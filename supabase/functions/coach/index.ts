import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface CoachRequest {
  contents: GeminiContent[];
  systemPrompt: string;
}

async function requireUser(req: Request): Promise<Response | null> {
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
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return json({ error: "Invalid session" }, 401);
  }

  return null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isConfiguredApiKey(apiKey: string | undefined): apiKey is string {
  return Boolean(
    apiKey &&
      !apiKey.includes("rotate-and-set") &&
      !apiKey.includes("your-") &&
      apiKey.trim().length > 20,
  );
}

function localiseToAustralian(text: string): string {
  const mapping: Record<string, string> = {
    summarize: "summarise",
    summarized: "summarised",
    summarizing: "summarising",
    realize: "realise",
    realized: "realised",
    realizing: "realising",
    program: "programme",
    color: "colour",
    center: "centre",
    defense: "defence",
    license: "licence",
    organize: "organise",
    organized: "organised",
    organizing: "organising",
    analyzer: "analyser",
    analyze: "analyse",
    analyzed: "analysed",
    analyzing: "analysing",
    modeling: "modelling",
    learned: "learnt",
  };

  let localised = text;
  for (const [us, au] of Object.entries(mapping)) {
    localised = localised.replace(new RegExp(`\\b${us}\\b`, "gi"), au);
  }
  return localised;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authError = await requireUser(req);
    if (authError) return authError;

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!isConfiguredApiKey(apiKey)) {
      return json(
        {
          error:
            "GEMINI_API_KEY is not configured in Supabase secrets. Set it with `supabase secrets set GEMINI_API_KEY=...`.",
        },
        500,
      );
    }

    let body: CoachRequest;
    try {
      body = (await req.json()) as CoachRequest;
    } catch {
      return json({ error: "Invalid JSON request body" }, 400);
    }

    if (!Array.isArray(body.contents) || !body.systemPrompt) {
      return json({ error: "Invalid coach request" }, 400);
    }

    const model = Deno.env.get("GEMINI_MODEL") || "gemini-flash-lite-latest";
    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: body.contents,
            system_instruction: {
              parts: [{ text: body.systemPrompt }],
            },
          }),
        },
      );
    } catch {
      return json(
        { error: "Could not reach Gemini. Check Supabase network egress and GEMINI_API_KEY." },
        502,
      );
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMessage = data.error?.message || response.statusText;
      const message =
        response.status === 429
          ? `Gemini quota exceeded for ${model}. Check Google AI Studio billing/rate limits or set GEMINI_MODEL to a model with available quota.`
          : errorMessage;
      return json({ error: message }, response.status);
    }

    const content = localiseToAustralian(data.candidates?.[0]?.content?.parts?.[0]?.text || "");
    return json({ content, xpAwarded: 10 });
  } catch (e) {
    console.error("coach error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
