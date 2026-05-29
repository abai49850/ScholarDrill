import { NextResponse } from "next/server";
import { localiseToAustralian } from "@/lib/utils/australian-localiser";

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

function isConfiguredApiKey(apiKey: string | undefined): apiKey is string {
  return Boolean(
    apiKey &&
      !apiKey.includes("rotate-and-set") &&
      !apiKey.includes("your-") &&
      apiKey.trim().length > 20,
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!isConfiguredApiKey(apiKey)) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is not configured. Add a real server-side Gemini API key to .env and restart the Next.js dev server.",
      },
      { status: 500 },
    );
  }

  let body: CoachRequest;
  try {
    body = (await request.json()) as CoachRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  if (!Array.isArray(body.contents) || !body.systemPrompt) {
    return NextResponse.json({ error: "Invalid coach request" }, { status: 400 });
  }

  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
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
    return NextResponse.json(
      { error: "Could not reach Gemini. Check the server network connection and GEMINI_API_KEY value." },
      { status: 502 },
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = data.error?.message || response.statusText;
    const message =
      response.status === 429
        ? `Gemini quota exceeded for ${model}. Check Google AI Studio billing/rate limits or set GEMINI_MODEL to a model with available quota.`
        : errorMessage;
    return NextResponse.json(
      { error: message },
      { status: response.status },
    );
  }

  const content = localiseToAustralian(data.candidates?.[0]?.content?.parts?.[0]?.text || "");
  return NextResponse.json({ content, xpAwarded: 10 });
}
