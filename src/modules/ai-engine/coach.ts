import type { TutorPersonality } from "@/data/tutors";
import { localiseToAustralian } from "@/lib/utils/australian-localiser";

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
  history: ChatMessage[],
  context?: {
    state?: string;
    yearLevel?: number;
    examType?: string;
    subject?: string;
  }
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

  // Enhanced system instruction with Australian context
  const systemPrompt = `You are ${tutor.name}, an AI Study Coach for Australian students. 
  Persona: ${tutor.personality}. Use ${tutor.emoji}.
  
  CONTEXT:
  - State: ${context?.state || 'Australia (General)'}
  - Year Level: ${context?.yearLevel || 'Unknown'}
  - Focus: ${context?.examType || 'General Study'} ${context?.subject ? `(${context?.subject})` : ''}
  
  RULES:
  1. Use Australian spelling (e.g., summarise, recognise, colour).
  2. Reference the relevant Australian state syllabus if the state is provided.
  3. Be encouraging and concise.
  4. Never mention you are an AI.`;

  const model = "gemini-2.0-flash";
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            system_instruction: {
              parts: [{ text: systemPrompt }]
            }
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        // Final pass for Australian spelling localisation
        text = localiseToAustralian(text);
        
        return { content: text, xpAwarded: 10 };
      }

      if (response.status === 429) {
        attempts++;
        await new Promise(r => setTimeout(r, attempts * 2000));
        continue;
      }

      throw new Error(data.error?.message || response.statusText);

    } catch (e: any) {
      if (attempts >= maxAttempts - 1) break;
      attempts++;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return { 
    content: "My 'Gemini 2.0' brain is a bit overwhelmed right now. 🧠 Please wait a moment and try again—I'm still here for you! 🌟",
    xpAwarded: 0 
  };
}
