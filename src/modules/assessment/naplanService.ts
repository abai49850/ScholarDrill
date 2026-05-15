import { supabase } from "@/integrations/supabase/client";
import type { SubjectDomain } from "../curriculum/types";

export type ExamMode = 'TIMED' | 'PRACTICE' | 'ADAPTIVE' | 'MOCK';

export interface NaplanSession {
  id: string;
  user_id: string;
  year_level: number;
  subject: SubjectDomain;
  mode: ExamMode;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  started_at: string;
  completed_at?: string;
  total_score: number;
  estimated_band?: string;
}

export class NaplanEngineService {
  /**
   * Starts a new NAPLAN session.
   */
  static async startSession(userId: string, yearLevel: number, subject: SubjectDomain, mode: ExamMode) {
    const { data, error } = await supabase
      .from('naplan_sessions')
      .insert({
        user_id: userId,
        year_level: yearLevel,
        subject: subject,
        mode: mode,
        status: 'IN_PROGRESS'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Adaptive Logic: Selects the next question based on recent performance.
   */
  static async getNextAdaptiveQuestion(sessionId: string, yearLevel: number, subject: SubjectDomain) {
    // 1. Get recent responses
    const { data: responses } = await supabase
      .from('naplan_responses')
      .select('is_correct, difficulty_at_time')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(5);

    // 2. Calculate target difficulty
    let targetDifficulty = 3; // Default
    if (responses && responses.length > 0) {
      const correctCount = responses.filter(r => r.is_correct).length;
      const avgDifficulty = responses.reduce((acc, r) => acc + (r.difficulty_at_time || 0), 0) / responses.length;
      
      if (correctCount >= 4) targetDifficulty = Math.min(10, avgDifficulty + 1);
      else if (correctCount <= 1) targetDifficulty = Math.max(1, avgDifficulty - 1);
      else targetDifficulty = avgDifficulty;
    }

    // 3. Fetch a question close to target difficulty
    const { data: question } = await supabase
      .from('questions')
      .select('*')
      .eq('year_level', yearLevel)
      .eq('subject', subject.toLowerCase())
      .eq('status', 'approved')
      .gte('difficulty', Math.floor(targetDifficulty))
      .lte('difficulty', Math.ceil(targetDifficulty))
      .limit(1)
      .single();

    return question;
  }

  /**
   * Completes a session and calculates scores/bands.
   */
  static async completeSession(sessionId: string) {
    const { data: session } = await supabase.from('naplan_sessions').select('*').eq('id', sessionId).single();
    const { data: responses } = await supabase.from('naplan_responses').select('*').eq('session_id', sessionId);

    if (!session || !responses) return null;

    const correctCount = responses.filter(r => r.is_correct).length;
    
    // Fetch benchmark for band prediction
    const { data: benchmark } = await supabase
      .from('naplan_benchmarks')
      .select('estimated_band, percentile_estimate')
      .eq('year_level', session.year_level)
      .eq('subject', session.subject)
      .lte('min_raw_score', correctCount)
      .gte('max_raw_score', correctCount)
      .single();

    // Update session
    const { data: updatedSession } = await supabase
      .from('naplan_sessions')
      .update({
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        total_score: Math.round((correctCount / responses.length) * 100),
        raw_score_count: correctCount,
        total_question_count: responses.length,
        estimated_band: benchmark?.estimated_band || 'Calculating...',
        percentile_rank: benchmark?.percentile_estimate || 0
      })
      .eq('id', sessionId)
      .select()
      .single();

    return updatedSession;
  }

  /**
   * Detects weak topics from a session.
   */
  static async getWeakTopics(sessionId: string) {
    const { data } = await supabase
      .from('naplan_responses')
      .select('is_correct, questions(topic)')
      .eq('session_id', sessionId);

    if (!data) return [];

    const topics: Record<string, { correct: number, total: number }> = {};
    data.forEach(r => {
      const topic = (r.questions as any).topic;
      if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
      topics[topic].total++;
      if (r.is_correct) topics[topic].correct++;
    });

    return Object.entries(topics)
      .map(([topic, stats]) => ({
        topic,
        accuracy: (stats.correct / stats.total) * 100
      }))
      .filter(t => t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);
  }
}
