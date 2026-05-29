import { supabase } from "@/integrations/supabase/client";
import type { QuestionSubject } from "@/lib/questionsApi";

export type ExamMode = "TIMED" | "PRACTICE" | "ADAPTIVE" | "MOCK";

export interface NaplanSession {
  id: string;
  user_id: string;
  year_level: number;
  subject: QuestionSubject;
  mode: ExamMode;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  started_at: string;
  completed_at?: string;
  total_score: number;
  estimated_band?: string;
}

interface NaplanResponseRow {
  is_correct: boolean;
  difficulty_at_time?: number | null;
  questions?: { topic?: string } | null;
}

export class NaplanEngineService {
  static async startSession(userId: string, yearLevel: number, subject: QuestionSubject, mode: ExamMode) {
    const { data, error } = await supabase
      .from("naplan_sessions")
      .insert({
        user_id: userId,
        year_level: yearLevel,
        subject,
        mode,
        status: "IN_PROGRESS",
      })
      .select()
      .single();

    if (error) throw error;
    return data as NaplanSession;
  }

  static async getNextAdaptiveQuestion(sessionId: string, yearLevel: number, subject: QuestionSubject) {
    const { data: responses } = await supabase
      .from("naplan_responses")
      .select("is_correct, difficulty_at_time")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(5);

    const rows = (responses ?? []) as NaplanResponseRow[];
    let targetDifficulty = 3;
    if (rows.length > 0) {
      const correctCount = rows.filter((r) => r.is_correct).length;
      const avgDifficulty =
        rows.reduce((acc, r) => acc + (r.difficulty_at_time || 0), 0) / rows.length;

      if (correctCount >= 4) targetDifficulty = Math.min(10, avgDifficulty + 1);
      else if (correctCount <= 1) targetDifficulty = Math.max(1, avgDifficulty - 1);
      else targetDifficulty = avgDifficulty;
    }

    const { data: question } = await supabase
      .from("questions")
      .select("*")
      .eq("year_level", yearLevel)
      .eq("subject", subject)
      .eq("status", "approved")
      .gte("difficulty", Math.floor(targetDifficulty))
      .lte("difficulty", Math.ceil(targetDifficulty))
      .limit(1)
      .single();

    return question;
  }

  static async completeSession(sessionId: string) {
    const { data: session } = await supabase.from("naplan_sessions").select("*").eq("id", sessionId).single();
    const { data: responses } = await supabase.from("naplan_responses").select("*").eq("session_id", sessionId);

    const rows = (responses ?? []) as NaplanResponseRow[];
    if (!session || rows.length === 0) return null;

    const correctCount = rows.filter((r) => r.is_correct).length;
    const { data: benchmark } = await supabase
      .from("naplan_benchmarks")
      .select("estimated_band, percentile_estimate")
      .eq("year_level", session.year_level)
      .eq("subject", session.subject)
      .lte("min_raw_score", correctCount)
      .gte("max_raw_score", correctCount)
      .single();

    const { data: updatedSession } = await supabase
      .from("naplan_sessions")
      .update({
        status: "COMPLETED",
        completed_at: new Date().toISOString(),
        total_score: Math.round((correctCount / rows.length) * 100),
        raw_score_count: correctCount,
        total_question_count: rows.length,
        estimated_band: benchmark?.estimated_band || "Calculating...",
        percentile_rank: benchmark?.percentile_estimate || 0,
      })
      .eq("id", sessionId)
      .select()
      .single();

    return updatedSession;
  }

  static async getWeakTopics(sessionId: string) {
    const { data } = await supabase
      .from("naplan_responses")
      .select("is_correct, questions(topic)")
      .eq("session_id", sessionId);

    const rows = (data ?? []) as NaplanResponseRow[];
    const topics: Record<string, { correct: number; total: number }> = {};
    rows.forEach((r) => {
      const topic = r.questions?.topic ?? "General";
      if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
      topics[topic].total++;
      if (r.is_correct) topics[topic].correct++;
    });

    return Object.entries(topics)
      .map(([topic, stats]) => ({
        topic,
        accuracy: (stats.correct / stats.total) * 100,
      }))
      .filter((t) => t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);
  }
}
