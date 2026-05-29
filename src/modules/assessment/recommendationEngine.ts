import { tutors } from "@/data/tutors";
import { generateResponse } from "../ai-engine/coach";
import { NaplanEngineService } from "./naplanService";

export class RecommendationEngine {
  static async generateStudyPlan(sessionId: string, tutorName: string = "Aria") {
    const weakTopics = await NaplanEngineService.getWeakTopics(sessionId);

    if (weakTopics.length === 0) {
      return "Fantastic work! You've mastered all the topics in this session. Let's try a higher difficulty level or a new subject to keep the momentum going.";
    }

    const topicList = weakTopics
      .map((t) => `${t.topic} (${Math.round(t.accuracy)}% accuracy)`)
      .join(", ");

    const prompt = `Based on a recent NAPLAN practice session, the student is struggling with the following topics: ${topicList}.
As their AI Study Coach, create a 3-step personalised study plan.
Focus on being encouraging and providing specific advice for Australian curriculum standards.
Keep it under 150 words and use Australian English.`;

    const tutor = {
      ...tutors[0],
      name: tutorName,
      personality: "Encouraging and analytical",
      emoji: "📈",
    };
    const result = await generateResponse(tutor, prompt, []);

    return result.content;
  }
}
