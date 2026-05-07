import { supabase } from "@/integrations/supabase/client";

export type QuestionSubject = "maths" | "reading" | "writing" | "conventions" | "reasoning";
export type QuestionExamType = "naplan" | "selective" | "scholarship" | "general";
export type QuestionStatus = "draft" | "approved";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface DbQuestion {
  id: string;
  legacy_id: string | null;
  content: string;
  options: QuestionOption[];
  correct_option_id: string;
  explanation: string;
  difficulty: number;
  subject: QuestionSubject;
  exam_type: QuestionExamType;
  year_level: number;
  topic: string;
  subtopic: string;
  skill_tags: string[];
  source_reference: string;
  time_limit_seconds: number;
  status: QuestionStatus;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
}

export type QuestionDraft = Omit<
  DbQuestion,
  "id" | "legacy_id" | "created_at" | "updated_at" | "approved_at"
>;

const TABLE = "questions";

export async function listQuestions(filters: {
  status?: QuestionStatus | "all";
  subject?: QuestionSubject | "all";
  examType?: QuestionExamType | "all";
  yearLevel?: number | "all";
  search?: string;
} = {}): Promise<DbQuestion[]> {
  let q = supabase.from(TABLE).select("*").order("updated_at", { ascending: false }).limit(1000);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.subject && filters.subject !== "all") q = q.eq("subject", filters.subject);
  if (filters.examType && filters.examType !== "all") q = q.eq("exam_type", filters.examType);
  if (filters.yearLevel && filters.yearLevel !== "all") q = q.eq("year_level", filters.yearLevel);
  if (filters.search) q = q.ilike("content", `%${filters.search}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as DbQuestion[];
}

export async function listApprovedQuestions(filters: {
  subject?: QuestionSubject;
  examType?: QuestionExamType;
  yearLevel?: number;
} = {}): Promise<DbQuestion[]> {
  let q = supabase.from(TABLE).select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(1000);
  if (filters.subject) q = q.eq("subject", filters.subject);
  if (filters.examType) q = q.eq("exam_type", filters.examType);
  if (filters.yearLevel !== undefined) {
    q = q.gte("year_level", filters.yearLevel - 2).lte("year_level", filters.yearLevel + 2);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as DbQuestion[];
}

export async function getQuestion(id: string): Promise<DbQuestion | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as unknown as DbQuestion) ?? null;
}

export async function createQuestion(draft: QuestionDraft): Promise<DbQuestion> {
  const payload = { ...draft, options: draft.options as unknown } as never;
  const { data, error } = await supabase.from(TABLE).insert(payload).select("*").single();
  if (error) throw error;
  return data as unknown as DbQuestion;
}

export async function updateQuestion(id: string, patch: Partial<QuestionDraft>): Promise<DbQuestion> {
  const payload = {
    ...patch,
    ...(patch.options ? { options: patch.options as unknown } : {}),
  } as never;
  const { data, error } = await supabase.from(TABLE).update(payload).eq("id", id).select("*").single();
  if (error) throw error;
  return data as unknown as DbQuestion;
}

export async function setQuestionStatus(id: string, status: QuestionStatus): Promise<DbQuestion> {
  const patch = {
    status,
    approved_at: status === "approved" ? new Date().toISOString() : null,
  } as never;
  const { data, error } = await supabase.from(TABLE).update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as unknown as DbQuestion;
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function getQuestionStats(): Promise<{
  total: number;
  approved: number;
  draft: number;
  bySubject: Record<string, number>;
  byYear: Record<string, number>;
  byExam: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("status, subject, year_level, exam_type")
    .limit(5000);
  if (error) throw error;
  const rows = (data ?? []) as Array<{
    status: QuestionStatus;
    subject: QuestionSubject;
    year_level: number;
    exam_type: QuestionExamType;
  }>;
  const stats = {
    total: rows.length,
    approved: 0,
    draft: 0,
    bySubject: {} as Record<string, number>,
    byYear: {} as Record<string, number>,
    byExam: {} as Record<string, number>,
  };
  for (const r of rows) {
    if (r.status === "approved") stats.approved++;
    else stats.draft++;
    stats.bySubject[r.subject] = (stats.bySubject[r.subject] ?? 0) + 1;
    stats.byYear[String(r.year_level)] = (stats.byYear[String(r.year_level)] ?? 0) + 1;
    stats.byExam[r.exam_type] = (stats.byExam[r.exam_type] ?? 0) + 1;
  }
  return stats;
}

// Mapping helpers between DB shape and existing Practice Question type
export function dbToPracticeQuestion(q: DbQuestion) {
  return {
    id: q.id,
    content: q.content,
    options: q.options,
    correctOptionId: q.correct_option_id,
    explanation: q.explanation,
    difficulty: Math.min(5, Math.max(1, q.difficulty)) as 1 | 2 | 3 | 4 | 5,
    topic: q.topic,
    subtopic: q.subtopic,
    yearLevel: q.year_level,
    timeLimitSeconds: q.time_limit_seconds,
    subject: q.subject,
  };
}
