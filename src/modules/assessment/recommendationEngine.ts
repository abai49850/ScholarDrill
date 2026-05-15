import { generateResponse } from "../ai-engine/coach";
import { NaplanEngineService } from "./naplanService";

export class RecommendationEngine {
  /**
   * Generates a personalised study plan based on NAPLAN performance.
   */
  static async generateStudyPlan(sessionId: string, tutorName: string = "Aria") {
    // 1. Get session analytics
    const weakTopics = await NaplanEngineService.getWeakTopics(sessionId);
    
    if (weakTopics.length === 0) {
      return "Fantastic work! You've mastered all the topics in this session. Let's try a higher difficulty level or a new subject to keep the momentum going! 🌟";
    }

    // 2. Format context for AI
    const topicList = weakTopics.map(t => `${t.topic} (${Math.round(t.accuracy)}% accuracy)`).join(", ");
    
    const prompt = `Based on a recent NAPLAN practice session, the student is struggling with the following topics: ${topicList}. 
    As their AI Study Coach, create a 3-step personalised study plan. 
    Focus on being encouraging and providing specific advice for Australian curriculum standards. 
    Keep it under 150 words and use Australian English.`;

    // 3. Call AI Engine (using existing tutor logic)
    const result = await generateResponse(
      { name: tutorName, personality: "Encouraging and analytical", emoji: "📈" } as any,
      prompt,
      []
    );

    return result.content;
  }
}
