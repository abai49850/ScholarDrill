import { examCards } from "@/data/examCatalog";
import type { PracticeRecommendation } from "@/lib/practiceAssignments";
import type { QuestionExamType, QuestionSubject } from "@/lib/questionsApi";
import type { UserStats } from "@/lib/statsApi";

const subjectToExam: Record<string, QuestionExamType> = {
  maths: "selective",
  reading: "selective",
  writing: "general",
  conventions: "naplan",
  reasoning: "selective",
  science: "general",
};

const subjectLabels: Record<QuestionSubject, string> = {
  maths: "Maths",
  reading: "Reading",
  writing: "Writing",
  conventions: "Conventions",
  reasoning: "Reasoning",
  science: "Science",
};

const allSubjects: QuestionSubject[] = ["maths", "reading", "writing", "conventions", "reasoning", "science"];

function normalizeSubject(subject: string): QuestionSubject {
  return ["maths", "reading", "writing", "conventions", "reasoning", "science"].includes(subject)
    ? (subject as QuestionSubject)
    : "reasoning";
}

function preferredTestId(subject: QuestionSubject, examType: QuestionExamType) {
  return examCards.find((card) => card.subjects.includes(subject) && card.dbExamType === examType)?.id
    ?? examCards.find((card) => card.subjects.includes(subject))?.id;
}

export function buildPracticeRecommendations(stats: UserStats, yearLevel: number): PracticeRecommendation[] {
  const focusRecommendations = stats.focusTopics.map((topic) => {
    const subject = normalizeSubject(topic.subject);
    const examType = subjectToExam[subject] ?? "general";
    return {
      title: `Target ${topic.topic}`,
      subject,
      examType,
      yearLevel,
      topic: topic.topic,
      testId: preferredTestId(subject, examType),
      reason: `${topic.accuracy}% accuracy across ${topic.attempted} attempts. A short targeted set should help close this gap.`,
    };
  });

  const statsBySubject = new Map(stats.bySubject.map((subject) => [subject.subject, subject]));
  const subjectRecommendations = allSubjects.map((subject) => {
    const subjectStat = statsBySubject.get(subject);
    const examType = subjectToExam[subject] ?? "general";
    const label = subjectLabels[subject];
    return {
      title: subjectStat ? `Build ${label} confidence` : `Start ${label} practice`,
      subject,
      examType,
      yearLevel,
      testId: preferredTestId(subject, examType),
      reason: subjectStat
        ? `${subjectStat.accuracy}% accuracy from ${subjectStat.attempted} attempts. Assign this if ${label.toLowerCase()} needs more attention.`
        : `No ${label.toLowerCase()} attempts yet. Assign this to create a first performance signal.`,
    };
  });

  const seen = new Set<string>();
  const recommendations = [...focusRecommendations, ...subjectRecommendations].filter((recommendation) => {
    const key = `${recommendation.title}:${recommendation.subject}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (recommendations.length > 0) return recommendations;

  return [];
}
