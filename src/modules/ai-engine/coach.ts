import type { TutorPersonality } from "@/data/tutors";

export interface ChatMessage {
  id: string;
  role: "student" | "tutor";
  content: string;
  timestamp: Date;
  xpAwarded?: number;
}

interface CoachApiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function generateResponse(
  tutor: TutorPersonality,
  message: string,
  history: ChatMessage[],
  context?: {
    state?: string;
    yearLevel?: number;
    examType?: string;
    subject?: string;
  },
): Promise<{ content: string; xpAwarded?: number }> {
  const studentMessages = history.filter((m) => m.role === "student");
  const lastStudentMessage = studentMessages[studentMessages.length - 1];
  const cleanHistory = history.filter((m) => m.id !== lastStudentMessage?.id);
  const firstStudentIndex = cleanHistory.findIndex((m) => m.role === "student");
  let validHistory = firstStudentIndex !== -1 ? cleanHistory.slice(firstStudentIndex) : [];
  const lastMsg = validHistory[validHistory.length - 1];
  if (lastMsg && lastMsg.role === "student") validHistory = validHistory.slice(0, -1);

  const contents: CoachApiContent[] = [
    ...validHistory.map((m) => ({
      role: m.role === "student" ? "user" as const : "model" as const,
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const systemPrompt = `You are ${tutor.name}, an AI Study Coach for Australian students.
Persona: ${tutor.personality}. Use ${tutor.emoji}.

CONTEXT:
- State: ${context?.state || "Australia (General)"}
- Year Level: ${context?.yearLevel || "Unknown"}
- Focus: ${context?.examType || "General Study"} ${context?.subject ? `(${context.subject})` : ""}

RULES:
1. Use Australian spelling (e.g., summarise, recognise, colour).
2. Reference the relevant Australian state syllabus if the state is provided.
3. Be encouraging and concise.
4. Never mention you are an AI.`;

  let attempts = 0;
  const maxAttempts = 3;
  let lastError = "The coach service is not available right now.";

  while (attempts < maxAttempts) {
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, systemPrompt }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) return { content: data.content || "", xpAwarded: data.xpAwarded ?? 10 };

      lastError = data.error || response.statusText;
      if (response.status === 429) {
        attempts++;
        await new Promise((r) => setTimeout(r, attempts * 2000));
        continue;
      }

      return {
        content: `AI coach is not connected yet: ${lastError}`,
        xpAwarded: 0,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Could not reach the coach service.";
      if (attempts >= maxAttempts - 1) break;
      attempts++;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return {
    content: `AI coach is not connected yet: ${lastError}`,
    xpAwarded: 0,
  };
}
