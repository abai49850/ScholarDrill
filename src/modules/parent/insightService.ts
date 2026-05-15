import { generateResponse } from "../ai-engine/coach";
import { ParentService } from "./parentService";

export class ParentInsightService {
  /**
   * Generates AI-driven insights for parents based on student data.
   */
  static async getParentInsights(studentId: string) {
    const summary = await ParentService.generateWeeklySummary(studentId);
    
    const context = `
      Exam Readiness: ${summary.readiness}%
      Progress Trends: ${JSON.stringify(summary.trends)}
      Recent Results: ${summary.recentSessions?.map(s => `${s.subject}: ${s.total_score}%`).join(", ")}
    `;

    const prompt = `
      You are an expert Australian education consultant. Provide a "Parent Insight Report" based on this data:
      ${context}
      
      Requirements:
      1. Highlight 1 "Celebration" (something the child did well).
      2. Identify 1 "Focus Area" (where they need help).
      3. Provide a "Strategy for Home" (practical advice for the parent).
      4. Use a professional yet encouraging tone.
      5. Keep it under 200 words.
    `;

    const result = await generateResponse(
      { name: "ScholarDrill Insights", personality: "Professional Consultant", emoji: "📋" } as any,
      prompt,
      []
    );

    return result.content;
  }
}
