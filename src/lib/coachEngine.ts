import type { TutorPersonality } from "@/data/tutors";

export interface ChatMessage {
  id: string;
  role: "student" | "tutor";
  content: string;
  timestamp: Date;
  xpAwarded?: number;
}

export async function generateResponse(
  tutor: TutorPersonality,
  message: string,
  history: ChatMessage[]
): Promise<{ content: string; xpAwarded?: number }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return { content: "API key is missing! Please restart your dev server. 🔑", xpAwarded: 0 };
  }

  // Gemini strictly requires alternating roles: user -> model -> user -> model.
  const studentMessages = history.filter(m => m.role === "student");
  const lastStudentMessage = studentMessages[studentMessages.length - 1];
  const cleanHistory = history.filter(m => m.id !== lastStudentMessage?.id);
  const firstStudentIndex = cleanHistory.findIndex(m => m.role === "student");
  let validHistory = firstStudentIndex !== -1 ? cleanHistory.slice(firstStudentIndex) : [];
  const lastMsg = validHistory[validHistory.length - 1];
  if (lastMsg && lastMsg.role === "student") {
    validHistory = validHistory.slice(0, -1);
  }

  const contents = [
    ...validHistory.map(m => ({
      role: m.role === "student" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] }
  ];

  // We now know gemini-2.0-flash is the ONLY one working for this key,
  // but it has a tight quota. We will focus on it with a better retry.
  const model = "gemini-2.0-flash";
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Connecting to Gemini 2.0 Flash (Attempt ${attempts + 1})...`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            system_instruction: {
              parts: [{ text: `You are ${tutor.name}, an AI Study Coach for Australian students. Tone: ${tutor.personality}. Use ${tutor.emoji}.` }]
            }
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { content: text, xpAwarded: 10 };
      }

      if (response.status === 429) {
        attempts++;
        const waitTime = attempts * 3000; // 3s, 6s...
        console.warn(`Quota reached. Waiting ${waitTime/1000}s...`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }

      // If it's a 404 or other error, it might be a temporary glitch, but we'll report it
      throw new Error(data.error?.message || response.statusText);

    } catch (e: any) {
      console.error(`Attempt ${attempts + 1} failed:`, e.message);
      if (attempts >= maxAttempts - 1) break;
      attempts++;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return { 
    content: "My 'Gemini 2.0' brain is a bit overwhelmed right now (Quota Exceeded). 🧠 Please wait about 60 seconds and try again—I really want to help you! 🌟",
    xpAwarded: 0 
  };
}
