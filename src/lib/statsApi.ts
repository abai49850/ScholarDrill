import { supabase } from "@/integrations/supabase/client";

export interface AttemptRow {
  id: string;
  subject: string;
  year_level: number;
  topic: string;
  difficulty: number;
  is_correct: boolean;
  time_spent_seconds: number;
  created_at: string;
}

export interface SubjectStat {
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
  recentScores: number[]; // last 7 sessions accuracy
  trend: number;
}

export interface UserStats {
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  bySubject: SubjectStat[];
  todayCount: number;
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: { day: string; date: string; count: number }[];
  monthlyActivity: { day: string; date: string; count: number }[];
  weeklyTrendPct: number;
}

const SUBJECT_LABELS: Record<string, string> = {
  maths: "Mathematics",
  reading: "Reading",
  writing: "Writing",
  reasoning: "Reasoning",
  conventions: "Conventions",
};

const SUBJECT_COLORS: Record<string, string> = {
  maths: "var(--subject-maths)",
  reading: "var(--subject-reading)",
  writing: "var(--subject-writing)",
  reasoning: "var(--subject-reasoning)",
  conventions: "var(--subject-conventions)",
};

export const SUBJECT_META = SUBJECT_LABELS;
export const SUBJECT_COLOR_VARS = SUBJECT_COLORS;

export async function recordAttempt(input: {
  questionId?: string | null;
  legacyQuestionId?: string | null;
  subject: string;
  yearLevel: number;
  topic: string;
  difficulty: number;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("practice_attempts").insert({
    user_id: user.id,
    question_id: input.questionId ?? null,
    legacy_question_id: input.legacyQuestionId ?? null,
    subject: input.subject,
    year_level: input.yearLevel,
    topic: input.topic,
    difficulty: input.difficulty,
    selected_option_id: input.selectedOptionId,
    correct_option_id: input.correctOptionId,
    is_correct: input.isCorrect,
    time_spent_seconds: input.timeSpentSeconds,
  });
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function getUserStats(userId: string, dailyGoal = 10): Promise<UserStats> {
  const { data, error } = await supabase
    .from("practice_attempts")
    .select("id,subject,year_level,topic,difficulty,is_correct,time_spent_seconds,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) throw error;
  const rows = (data ?? []) as AttemptRow[];

  const totalAttempted = rows.length;
  const totalCorrect = rows.filter((r) => r.is_correct).length;
  const overallAccuracy = totalAttempted ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Group by subject
  const bySubMap = new Map<string, AttemptRow[]>();
  for (const r of rows) {
    if (!bySubMap.has(r.subject)) bySubMap.set(r.subject, []);
    bySubMap.get(r.subject)!.push(r);
  }
  const bySubject: SubjectStat[] = [];
  for (const [subject, list] of bySubMap.entries()) {
    const correct = list.filter((r) => r.is_correct).length;
    const acc = Math.round((correct / list.length) * 100);
    // Last 7 chunked sessions of ~5 attempts
    const chunks: number[] = [];
    const chunkSize = Math.max(3, Math.ceil(list.length / 7));
    for (let i = 0; i < list.length && chunks.length < 7; i += chunkSize) {
      const slice = list.slice(i, i + chunkSize);
      const c = slice.filter((r) => r.is_correct).length;
      chunks.unshift(Math.round((c / slice.length) * 100));
    }
    while (chunks.length < 7) chunks.unshift(acc);
    const trend = chunks.length >= 2 ? chunks[chunks.length - 1] - chunks[0] : 0;
    bySubject.push({ subject, attempted: list.length, correct, accuracy: acc, recentScores: chunks, trend });
  }

  // Weekly activity (last 7 days incl. today)
  const today = new Date();
  const weeklyActivity: UserStats["weeklyActivity"] = [];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const countsByDate = new Map<string, number>();
  for (const r of rows) countsByDate.set(r.created_at.slice(0, 10), (countsByDate.get(r.created_at.slice(0, 10)) ?? 0) + 1);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = ymd(d);
    weeklyActivity.push({ day: dayLabels[d.getDay()], date: key, count: countsByDate.get(key) ?? 0 });
  }
  const todayCount = countsByDate.get(ymd(today)) ?? 0;

  // Monthly activity (last 30 days)
  const monthlyActivity: UserStats["monthlyActivity"] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = ymd(d);
    monthlyActivity.push({ day: d.getDate().toString(), date: key, count: countsByDate.get(key) ?? 0 });
  }

  // Streak (consecutive days with at least one attempt)
  let currentStreak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const c = countsByDate.get(ymd(d)) ?? 0;
    if (c > 0) currentStreak++;
    else if (i > 0) break;
  }
  // Longest streak
  let longestStreak = 0;
  let run = 0;
  const sortedDates = [...countsByDate.keys()].sort();
  let prev: Date | null = null;
  for (const k of sortedDates) {
    const d = new Date(k);
    if (!prev) { run = 1; }
    else {
      const diff = Math.round((d.getTime() - prev.getTime()) / 86_400_000);
      run = diff === 1 ? run + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, run);
    prev = d;
  }

  // Weekly trend: this week's accuracy vs prev week
  const oneDay = 86_400_000;
  const weekStart = new Date(today.getTime() - 7 * oneDay);
  const prevStart = new Date(today.getTime() - 14 * oneDay);
  const thisWeek = rows.filter((r) => new Date(r.created_at) >= weekStart);
  const prevWeek = rows.filter((r) => new Date(r.created_at) >= prevStart && new Date(r.created_at) < weekStart);
  const acc = (l: AttemptRow[]) => l.length ? Math.round((l.filter((r) => r.is_correct).length / l.length) * 100) : 0;
  const weeklyTrendPct = acc(thisWeek) - acc(prevWeek);

  void dailyGoal;

  return {
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    bySubject,
    todayCount,
    currentStreak,
    longestStreak,
    weeklyActivity,
    monthlyActivity,
    weeklyTrendPct,
  };
}
