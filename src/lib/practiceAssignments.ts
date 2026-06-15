import type { QuestionExamType, QuestionSubject } from "@/lib/questionsApi";

export interface PracticeAssignment {
  id: string;
  title: string;
  subject: QuestionSubject;
  examType: QuestionExamType;
  yearLevel: number;
  topic?: string;
  testId?: string;
  reason: string;
  createdAt: string;
}

export interface PracticeRecommendation {
  title: string;
  subject: QuestionSubject;
  examType: QuestionExamType;
  yearLevel: number;
  topic?: string;
  testId?: string;
  reason: string;
}

function storageKey(userId: string) {
  return `sd_practice_assignments:${userId}`;
}

export function loadPracticeAssignments(userId?: string | null): PracticeAssignment[] {
  if (!userId || typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) || "[]") as PracticeAssignment[];
  } catch {
    return [];
  }
}

export function savePracticeAssignments(userId: string, assignments: PracticeAssignment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(assignments));
}

export function addPracticeAssignment(userId: string, recommendation: PracticeRecommendation) {
  const existing = loadPracticeAssignments(userId);
  const assignment: PracticeAssignment = {
    ...recommendation,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [assignment, ...existing].slice(0, 8);
  savePracticeAssignments(userId, next);
  return next;
}

export function removePracticeAssignment(userId: string, assignmentId: string) {
  const next = loadPracticeAssignments(userId).filter((assignment) => assignment.id !== assignmentId);
  savePracticeAssignments(userId, next);
  return next;
}

export function assignmentPracticeUrl(assignment: Pick<PracticeAssignment, "subject" | "examType" | "yearLevel" | "testId">) {
  const params = new URLSearchParams({
    subject: assignment.subject,
    exam: assignment.examType,
    year: String(assignment.yearLevel),
  });
  if (assignment.testId) params.set("testId", assignment.testId);
  return `/practice?${params.toString()}`;
}
