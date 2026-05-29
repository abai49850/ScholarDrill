import { supabase } from "@/integrations/supabase/client";
import { generateResponse, type ChatMessage } from "./coach";
import { tutors } from "@/data/tutors";
import type { AustralianState } from "../curriculum/types";

interface StudentMemoryRow {
  key: string;
  value: unknown;
}

interface MasteryRow {
  mastery_score: number;
  curriculum_taxonomy?: {
    title?: string;
  } | null;
}

export interface StudentContext {
  userId: string;
  state: AustralianState;
  yearLevel: number;
  memory: Record<string, unknown>;
  mastery: MasteryRow[];
}

export class AIOrchestrator {
  static async getTutoringResponse(userId: string, message: string, history: ChatMessage[]) {
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    const { data: memory } = await supabase.from("student_ai_memory").select("*").eq("user_id", userId);
    const { data: mastery } = await supabase
      .from("student_skill_mastery")
      .select("*, curriculum_taxonomy(*)")
      .eq("user_id", userId);

    const memoryRows = (memory ?? []) as StudentMemoryRow[];
    const masteryRows = (mastery ?? []) as MasteryRow[];
    const context: StudentContext = {
      userId,
      state: (profile?.region as AustralianState) || "NSW",
      yearLevel: profile?.year_level || 5,
      memory: memoryRows.reduce<Record<string, unknown>>((acc, m) => ({ ...acc, [m.key]: m.value }), {}),
      mastery: masteryRows,
    };

    const weakTopics = context.mastery
      .filter((m) => m.mastery_score < 0.6)
      .map((m) => m.curriculum_taxonomy?.title)
      .filter((title): title is string => Boolean(title));

    const tutor = {
      ...tutors[0],
      name: "Coach Aria",
      personality: `Encouraging Tutor. Known gaps: ${weakTopics.join(", ") || "none yet"}. Memory: ${JSON.stringify(context.memory)}.`,
      emoji: "🧠",
    };

    return generateResponse(tutor, message, history, {
      state: context.state,
      yearLevel: context.yearLevel,
    });
  }

  static async getRevisionPriorities(userId: string) {
    const { data: queue } = await supabase
      .from("revision_queue")
      .select("*, curriculum_taxonomy(*)")
      .eq("user_id", userId)
      .lte("next_review_at", new Date().toISOString())
      .limit(3);

    return queue;
  }
}
