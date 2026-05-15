import { supabase } from "@/integrations/supabase/client";
import { generateResponse } from "./coach";
import type { AustralianState, SubjectDomain } from "../curriculum/types";

export interface StudentContext {
  userId: string;
  state: AustralianState;
  yearLevel: number;
  memory: Record<string, any>;
  mastery: any[];
}

export class AIOrchestrator {
  /**
   * Orchestrates a tutoring session based on full student context.
   */
  static async getTutoringResponse(userId: string, message: string, history: any[]) {
    // 1. Gather Context
    const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    const { data: memory } = await supabase.from('student_ai_memory').select('*').eq('user_id', userId);
    const { data: mastery } = await supabase.from('student_skill_mastery').select('*, curriculum_taxonomy(*)').eq('user_id', userId);

    const context: StudentContext = {
      userId,
      state: (profile?.region as AustralianState) || 'NSW',
      yearLevel: profile?.year_level || 5,
      memory: memory?.reduce((acc, m) => ({ ...acc, [m.key]: m.value }), {}) || {},
      mastery: mastery || []
    };

    // 2. Identify Weaknesses
    const weakTopics = context.mastery
      .filter(m => m.mastery_score < 0.6)
      .map(m => m.curriculum_taxonomy.title);

    // 3. Build Dynamic Prompt
    const systemPrompt = `
      You are an expert Australian AI Tutor. 
      Student Context: ${context.yearLevel} ${context.state} student.
      Known Gaps: ${weakTopics.join(", ")}.
      Memory: ${JSON.stringify(context.memory)}.
      
      GOALS:
      1. Address their specific gaps using the Socratic method (ask questions to lead them to the answer).
      2. Use Australian curriculum examples (e.g., refer to local currency, units, or state-specific syllabus outcomes).
      3. Maintain a supportive, high-energy coaching tone.
    `;

    // 4. Call AI (Using existing coach engine)
    return await generateResponse(
      { name: "Coach Aria", personality: "Encouraging Tutor", emoji: "🧠" } as any,
      message,
      history,
      { state: context.state, yearLevel: context.yearLevel }
    );
  }

  /**
   * Spaced Repetition logic to suggest what to review today.
   */
  static async getRevisionPriorities(userId: string) {
    const { data: queue } = await supabase
      .from('revision_queue')
      .select('*, curriculum_taxonomy(*)')
      .eq('user_id', userId)
      .lte('next_review_at', new Date().toISOString())
      .limit(3);

    return queue;
  }
}
