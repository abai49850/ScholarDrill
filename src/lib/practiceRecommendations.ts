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
  const focusRecommendations = stats.focusTopics.slice(0, 3).map((topic) => {
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

  const subjectRecommendations = [...stats.bySubject]
    .filter((subject) => !focusRecommendations.some((rec) => rec.subject === subject.subject))
    .sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted)
    .slice(0, Math.max(0, 3 - focusRecommendations.length))
    .map((subjectStat) => {
      const subject = normalizeSubject(subjectStat.subject);
      const examType = subjectToExam[subject] ?? "general";
      return {
        title: `Build ${subjectStat.subject} confidence`,
        subject,
        examType,
        yearLevel,
        testId: preferredTestId(subject, examType),
        reason: `${subjectStat.accuracy}% accuracy in ${subjectStat.subject}; assign a focused practice block next.`,
      };
    });

  const recommendations = [...focusRecommendations, ...subjectRecommendations];
  if (recommendations.length > 0) return recommendations;

  return [
    {
      title: "Start a selective reasoning check",
      subject: "reasoning",
      examType: "selective",
      yearLevel,
      testId: preferredTestId("reasoning", "selective"),
      reason: "No practice data yet. Start with reasoning to create the first diagnostic signal.",
    },
    {
      title: "Try ICAS Science foundations",
      subject: "science",
      examType: "general",
      yearLevel,
      testId: preferredTestId("science", "general"),
      reason: "Science builds useful data interpretation and investigation skills.",
    },
  ];
}
