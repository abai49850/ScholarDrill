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

export interface TopicStat {
  topic: string;
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  desc: string;
  progress: number;
  target: number;
  xp: number;
}

export interface UserStats {
  totalAttempted: number;
  totalCorrect: number;
  totalPoints: number;
  overallAccuracy: number;
  bySubject: SubjectStat[];
  todayCount: number;
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: { day: string; date: string; count: number }[];
  monthlyActivity: { day: string; date: string; count: number }[];
  weeklyTrendPct: number;
  recentAttempts: AttemptRow[];
  byTopic: TopicStat[];
  strongestTopics: TopicStat[];
  focusTopics: TopicStat[];
  dailyQuests: DailyQuest[];
  performanceTrend: { label: string; score: number; benchmark: number }[];
  activeDaysLast30: number;
  mathsToday: number;
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
  const totalPoints = totalCorrect * 10 + totalAttempted * 2;
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
  const todayKey = ymd(today);
  const todayRows = rows.filter((r) => r.created_at.slice(0, 10) === todayKey);
  const mathsToday = todayRows.filter((r) => r.subject === "maths").length;

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

  const byTopicMap = new Map<string, AttemptRow[]>();
  for (const r of rows) {
    const key = `${r.subject}:${r.topic || "General"}`;
    if (!byTopicMap.has(key)) byTopicMap.set(key, []);
    byTopicMap.get(key)!.push(r);
  }
  const byTopic: TopicStat[] = [...byTopicMap.entries()].map(([key, list]) => {
    const [subject, ...topicParts] = key.split(":");
    const correct = list.filter((r) => r.is_correct).length;
    return {
      topic: topicParts.join(":") || "General",
      subject,
      attempted: list.length,
      correct,
      accuracy: Math.round((correct / list.length) * 100),
    };
  });
  const meaningfulTopics = byTopic.filter((t) => t.attempted >= 2);
  const strongestTopics = [...meaningfulTopics]
    .sort((a, b) => b.accuracy - a.accuracy || b.attempted - a.attempted)
    .slice(0, 3);
  const focusTopics = [...meaningfulTopics]
    .sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted)
    .slice(0, 3);

  const streakToday = (() => {
    let run = 0;
    for (const r of todayRows) {
      if (r.is_correct) run++;
      else run = 0;
    }
    return run;
  })();

  const readingTopicsToday = new Set(todayRows.filter((r) => r.subject === "reading").map((r) => r.topic || r.id));
  const dailyQuests: DailyQuest[] = [
    {
      id: "maths-20",
      title: "Numeracy Ninja",
      desc: "Complete 20 maths questions today.",
      progress: mathsToday,
      target: 20,
      xp: 50,
    },
    {
      id: "perfect-10",
      title: "Perfect Run",
      desc: "Answer 10 questions correctly in a row today.",
      progress: Math.min(streakToday, 10),
      target: 10,
      xp: 100,
    },
    {
      id: "reading-2",
      title: "Reading Explorer",
      desc: "Complete 2 reading topics today.",
      progress: readingTopicsToday.size,
      target: 2,
      xp: 75,
    },
  ];

  const performanceTrend = Array.from({ length: 6 }).map((_, index) => {
    const start = new Date(today);
    start.setDate(today.getDate() - (6 - index) * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const weekRows = rows.filter((r) => {
      const created = new Date(r.created_at);
      return created >= start && created < end;
    });
    return {
      label: `Week ${index + 1}`,
      score: acc(weekRows),
      benchmark: 70 + Math.min(index, 3) * 2,
    };
  });
  const activeDaysLast30 = monthlyActivity.filter((d) => d.count > 0).length;

  return {
    totalAttempted,
    totalCorrect,
    totalPoints,
    overallAccuracy,
    bySubject,
    todayCount,
    currentStreak,
    longestStreak,
    weeklyActivity,
    monthlyActivity,
    weeklyTrendPct,
    recentAttempts: rows.slice(0, 10),
    byTopic,
    strongestTopics,
    focusTopics,
    dailyQuests,
    performanceTrend,
    activeDaysLast30,
    mathsToday,
  };
}

export function buildPerformanceSummary(stats: UserStats, dailyGoal = 10) {
  const strongestTopic = stats.strongestTopics[0];
  const focusTopic = stats.focusTopics[0];
  const strongestSubject = [...stats.bySubject].sort((a, b) => b.accuracy - a.accuracy)[0];
  const focusSubject = [...stats.bySubject].sort((a, b) => a.accuracy - b.accuracy)[0];
  const strongestLabel = strongestTopic?.topic ?? strongestSubject?.subject;
  const strongestAccuracy = strongestTopic?.accuracy ?? strongestSubject?.accuracy;
  const focusLabel = focusTopic?.topic ?? focusSubject?.subject;
  const focusAccuracy = focusTopic?.accuracy ?? focusSubject?.accuracy;
  return [
    `${stats.totalAttempted} questions attempted with ${stats.overallAccuracy}% overall accuracy.`,
    `${stats.todayCount}/${dailyGoal} daily goal questions completed today.`,
    `${stats.currentStreak}-day current streak; ${stats.longestStreak}-day best streak.`,
    strongestLabel ? `Strength: ${strongestLabel} (${strongestAccuracy}%).` : "No clear strength yet.",
    focusLabel ? `Focus area: ${focusLabel} (${focusAccuracy}%).` : "No clear focus area yet.",
  ].join(" ");
}
