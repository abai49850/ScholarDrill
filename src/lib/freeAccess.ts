import { supabase } from "@/integrations/supabase/client";
import {
  listApprovedQuestions,
  type DbQuestion,
  type QuestionSubject,
} from "@/lib/questionsApi";

export const FREE_DAILY_LIMIT = 10;

/** Has this free user already practised today (UTC day)? */
export async function hasPractisedToday(userId: string): Promise<boolean> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("practice_attempts")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", userId)
    .gte("created_at", since.toISOString());
  if (error) return false;
  return (count ?? 0) >= FREE_DAILY_LIMIT;
}

/**
 * Free-tier sample: a fixed set of approved, free-sample-flagged questions for
 * the user's year level. Falls back to the first 10 approved questions for that
 * year if the admin hasn't curated a set yet.
 */
export async function loadFreeSampleQuestions(
  yearLevel: number,
  subject?: QuestionSubject
): Promise<DbQuestion[]> {
  let q = supabase
    .from("questions")
    .select("*")
    .eq("status", "approved")
    .eq("is_free_sample", true)
    .eq("year_level", yearLevel)
    .order("created_at", { ascending: true })
    .limit(FREE_DAILY_LIMIT);
  if (subject) q = q.eq("subject", subject);
  const { data, error } = await q;
  if (error) throw error;
  if (data && data.length > 0) return data as unknown as DbQuestion[];
  // Fallback: first N approved questions matching year level
  const fallback = await listApprovedQuestions({ yearLevel, ...(subject ? { subject } : {}) });
  return fallback.slice(0, FREE_DAILY_LIMIT);
}
