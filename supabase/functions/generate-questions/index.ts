// Edge function: generate-questions
// Uses Lovable AI Gateway (Gemini) to generate curriculum-aligned NAPLAN/selective questions.
// Returns JSON via tool-calling for reliable structured output.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUBJECTS = ["maths", "reading", "writing", "conventions", "reasoning"] as const;
const EXAM_TYPES = ["naplan", "selective", "scholarship", "general"] as const;

interface GenRequest {
  subject: typeof SUBJECTS[number];
  examType: typeof EXAM_TYPES[number];
  yearLevel: number;
  topic?: string;
  subtopic?: string;
  skillTags?: string[];
  difficulty?: number; // 1-5
  count?: number; // 1-10
  notes?: string;
}

function buildSystemPrompt() {
  return `You are an expert Australian K-12 curriculum writer specialising in NAPLAN, selective school, and scholarship exam preparation.

Your job is to author ORIGINAL multiple-choice questions that are:
- Curriculum-aligned to the Australian Curriculum (ACARA) for the given year level
- Inspired by the style of NAPLAN / selective tests, but PARAPHRASED and original — never reproduce verbatim past-paper content (copyright safety)
- Age-appropriate in vocabulary, context, and cognitive load
- Unambiguous, with exactly ONE correct answer and three plausible distractors
- Australian English spelling and Australian contexts (dollars, kilometres, native animals, etc.) where natural

For each question provide:
- content: the question stem (use plain text; for maths you may use simple inline notation like 3/4, 2x+5)
- options: exactly 4 options, each with a stable id ("a","b","c","d") and text
- correctOptionId: one of "a","b","c","d"
- explanation: a concise worked solution / reasoning a student can learn from
- topic & subtopic: specific (e.g. topic="Fractions", subtopic="Equivalent fractions")
- skillTags: 2-4 short tags
- difficulty: integer 1 (easy) to 5 (hard)
- timeLimitSeconds: realistic per-question time (30-120)

Quality bar: every question must be solvable from the stem alone, distractors should reflect common misconceptions, and the explanation must justify the correct answer.`;
}

function buildUserPrompt(req: GenRequest) {
  const lines = [
    `Generate ${req.count ?? 5} fresh multiple-choice questions.`,
    `Subject: ${req.subject}`,
    `Exam style: ${req.examType}`,
    `Year level: ${req.yearLevel}`,
  ];
  if (req.topic) lines.push(`Topic focus: ${req.topic}`);
  if (req.subtopic) lines.push(`Subtopic: ${req.subtopic}`);
  if (req.skillTags?.length) lines.push(`Target skills: ${req.skillTags.join(", ")}`);
  if (req.difficulty) lines.push(`Target difficulty (1-5): ${req.difficulty}`);
  if (req.notes) lines.push(`Additional guidance: ${req.notes}`);
  lines.push("Return all questions via the emit_questions tool.");
  return lines.join("\n");
}

const tool = {
  type: "function",
  function: {
    name: "emit_questions",
    description: "Return the generated curriculum-aligned questions.",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              content: { type: "string" },
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", enum: ["a", "b", "c", "d"] },
                    text: { type: "string" },
                  },
                  required: ["id", "text"],
                  additionalProperties: false,
                },
                minItems: 4,
                maxItems: 4,
              },
              correctOptionId: { type: "string", enum: ["a", "b", "c", "d"] },
              explanation: { type: "string" },
              topic: { type: "string" },
              subtopic: { type: "string" },
              skillTags: { type: "array", items: { type: "string" } },
              difficulty: { type: "integer", minimum: 1, maximum: 5 },
              timeLimitSeconds: { type: "integer", minimum: 20, maximum: 300 },
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
            additionalProperties: false,
          },
        },
      },
      required: ["questions"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as GenRequest;

    if (!SUBJECTS.includes(body.subject)) {
      return new Response(JSON.stringify({ error: "Invalid subject" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!EXAM_TYPES.includes(body.examType)) {
      return new Response(JSON.stringify({ error: "Invalid examType" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!body.yearLevel || body.yearLevel < 1 || body.yearLevel > 12) {
      return new Response(JSON.stringify({ error: "Invalid yearLevel" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    body.count = Math.max(1, Math.min(10, body.count ?? 5));

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(body) },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "emit_questions" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (aiResp.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Top up workspace credits to continue." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error", detail: t }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call returned", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Model did not return structured questions" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: { questions: unknown[] };
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Bad JSON from model", e, toolCall.function.arguments);
      return new Response(JSON.stringify({ error: "Could not parse AI response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        questions: parsed.questions ?? [],
        meta: {
          subject: body.subject,
          examType: body.examType,
          yearLevel: body.yearLevel,
          topic: body.topic ?? "",
          subtopic: body.subtopic ?? "",
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-questions error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
