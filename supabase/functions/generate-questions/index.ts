// Edge function: generate-questions
// Uses Gemini directly to generate original exam-aligned questions for the admin library.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUBJECTS = ["maths", "reading", "writing", "conventions", "reasoning", "science"] as const;
const EXAM_TYPES = ["naplan", "selective", "scholarship", "general"] as const;

interface ExamPathway {
  id: string;
  title: string;
  category: string;
  sourceLabel?: string;
  sourceUrl?: string;
  sections?: Array<{
    name: string;
    subject: string;
    questionLabel: string;
    minutes: number;
    focus: string;
  }>;
}

interface GenRequest {
  subject: typeof SUBJECTS[number];
  examType: typeof EXAM_TYPES[number];
  yearLevel: number;
  topic?: string;
  subtopic?: string;
  skillTags?: string[];
  difficulty?: number;
  count?: number;
  notes?: string;
  examPathway?: ExamPathway;
}

async function requireAdmin(req: Request): Promise<Response | null> {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  const authorization = req.headers.get("Authorization");

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return json({ error: "Server auth not configured" }, 500);
  }
  if (!authorization) {
    return json({ error: "Authentication required" }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return json({ error: "Invalid session" }, 401);
  }

  const { data: role, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !role) {
    return json({ error: "Admin access required" }, 403);
  }

  return null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isConfiguredApiKey(apiKey: string | undefined) {
  return Boolean(apiKey && !apiKey.includes("rotate-and-set") && !apiKey.includes("your-") && apiKey.trim().length > 20);
}

function buildSystemPrompt() {
  return `You are an expert Australian K-12 curriculum writer for ScholarEdge.

Write ORIGINAL multiple-choice practice questions for Australian exam preparation. Cover NAPLAN, ICAS, NSW/VIC selective entry, ACER scholarship, EduTest, HSC and VCE pathways when requested.

Strict rules:
- Do not copy, quote, paraphrase closely, or recreate any official, past-paper, paid, or third-party sample question.
- Use source links and exam descriptions only for structure, timing, skill focus and style guidance.
- Every generated question must be new, self-contained, age-appropriate, and in Australian English.
- Vary contexts, numbers, names, source snippets, and distractor logic across the batch.
- Do not produce near-duplicate questions within the same response.
- Return exactly four options with ids "a", "b", "c" and "d".
- Exactly one option must be correct.
- Explanations must teach the reasoning, not just name the answer.
- For writing pathways, generate multiple-choice questions about planning, structure, expression, editing, audience, purpose, or text improvement unless explicitly asked for an open writing prompt.

Return only valid JSON matching the requested schema.`;
}

function buildUserPrompt(req: GenRequest) {
  const lines = [
    `Generate ${req.count ?? 5} fresh multiple-choice questions.`,
    `Subject: ${req.subject}`,
    `Database exam type: ${req.examType}`,
    `Year level: ${req.yearLevel}`,
  ];
  if (req.examPathway) {
    lines.push(`Exam pathway: ${req.examPathway.title}`);
    lines.push(`Pathway category: ${req.examPathway.category}`);
    if (req.examPathway.sourceLabel) lines.push(`Format source label: ${req.examPathway.sourceLabel}`);
    if (req.examPathway.sourceUrl) lines.push(`Format source URL: ${req.examPathway.sourceUrl}`);
    if (req.examPathway.sections?.length) {
      lines.push(
        `Exam sections: ${req.examPathway.sections
          .map((s) => `${s.name} (${s.subject}, ${s.questionLabel}, ${s.minutes} min): ${s.focus}`)
          .join("; ")}`,
      );
    }
  }
  if (req.topic) lines.push(`Topic focus: ${req.topic}`);
  if (req.subtopic) lines.push(`Subtopic: ${req.subtopic}`);
  if (req.skillTags?.length) lines.push(`Target skills: ${req.skillTags.join(", ")}`);
  if (req.difficulty) lines.push(`Target difficulty (1-5): ${req.difficulty}`);
  if (req.notes) lines.push(`Additional guidance: ${req.notes}`);
  lines.push("Respond as JSON with a top-level questions array.");
  return lines.join("\n");
}

function responseSchema() {
  return {
    type: "OBJECT",
    properties: {
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            content: { type: "STRING" },
            options: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  text: { type: "STRING" },
                },
                required: ["id", "text"],
              },
            },
            correctOptionId: { type: "STRING" },
            explanation: { type: "STRING" },
            topic: { type: "STRING" },
            subtopic: { type: "STRING" },
            skillTags: { type: "ARRAY", items: { type: "STRING" } },
            difficulty: { type: "INTEGER" },
            timeLimitSeconds: { type: "INTEGER" },
          },
          required: [
            "content",
            "options",
            "correctOptionId",
            "explanation",
            "topic",
            "skillTags",
            "difficulty",
            "timeLimitSeconds",
          ],
        },
      },
    },
    required: ["questions"],
  };
}

function parseGeminiJson(data: Record<string, unknown>) {
  const parts = data?.candidates?.[0]?.content?.parts as Array<{ text?: string }> | undefined;
  const text = parts?.map((p) => p.text ?? "").join("").trim() ?? "";
  if (!text) throw new Error("Gemini returned an empty response");
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

function normaliseQuestions(raw: unknown, fallbackDifficulty: number) {
  const questions = Array.isArray((raw as { questions?: unknown[] })?.questions)
    ? (raw as { questions: unknown[] }).questions
    : [];

  return questions.map((q) => {
    const item = q as Record<string, unknown>;
    const options = Array.isArray(item.options) ? item.options.slice(0, 4) : [];
    return {
      content: String(item.content ?? ""),
      options: options.map((option, idx) => {
        const o = option as Record<string, unknown>;
        return {
          id: ["a", "b", "c", "d"][idx],
          text: String(o.text ?? ""),
        };
      }),
      correctOptionId: ["a", "b", "c", "d"].includes(String(item.correctOptionId)) ? String(item.correctOptionId) : "a",
      explanation: String(item.explanation ?? ""),
      topic: String(item.topic ?? "General"),
      subtopic: String(item.subtopic ?? ""),
      skillTags: Array.isArray(item.skillTags) ? item.skillTags.map(String).slice(0, 5) : [],
      difficulty: Math.max(1, Math.min(5, Number(item.difficulty) || fallbackDifficulty)),
      timeLimitSeconds: Math.max(20, Math.min(900, Number(item.timeLimitSeconds) || 60)),
    };
  }).filter((q) => q.content && q.options.length === 4 && q.options.every((o) => o.text));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!isConfiguredApiKey(apiKey)) {
      return json({
        error: "GEMINI_API_KEY is not configured in Supabase secrets. Set it with `supabase secrets set GEMINI_API_KEY=...`.",
      }, 500);
    }

    const body = (await req.json()) as GenRequest;
    if (!SUBJECTS.includes(body.subject)) return json({ error: "Invalid subject" }, 400);
    if (!EXAM_TYPES.includes(body.examType)) return json({ error: "Invalid examType" }, 400);
    if (!body.yearLevel || body.yearLevel < 1 || body.yearLevel > 12) return json({ error: "Invalid yearLevel" }, 400);

    body.count = Math.max(1, Math.min(25, body.count ?? 5));
    body.difficulty = Math.max(1, Math.min(5, body.difficulty ?? 3));

    const model = Deno.env.get("GEMINI_QUESTION_MODEL") || Deno.env.get("GEMINI_MODEL") || "gemini-flash-lite-latest";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildUserPrompt(body) }],
          },
        ],
        system_instruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
        generationConfig: {
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: responseSchema(),
        },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.error?.message || response.statusText;
      return json({
        error: response.status === 429
          ? `Gemini quota exceeded for ${model}. Check Google AI Studio billing/rate limits or set GEMINI_QUESTION_MODEL to a model with available quota.`
          : message,
      }, response.status);
    }

    let parsed: unknown;
    try {
      parsed = parseGeminiJson(data as Record<string, unknown>);
    } catch (e) {
      console.error("Bad JSON from Gemini", e, JSON.stringify(data));
      return json({ error: "Could not parse Gemini response" }, 502);
    }

    const questions = normaliseQuestions(parsed, body.difficulty);
    return json({
      questions,
      meta: {
        subject: body.subject,
        examType: body.examType,
        yearLevel: body.yearLevel,
        examPathway: body.examPathway?.id ?? null,
        topic: body.topic ?? "",
        subtopic: body.subtopic ?? "",
      },
    });
  } catch (e) {
    console.error("generate-questions error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
