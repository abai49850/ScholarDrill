// Mock student progress data for dashboard

export interface SubjectProgress {
  subject: "maths" | "reading" | "writing" | "reasoning" | "conventions";
  label: string;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  trend: number; // percentage change from last week
  recentScores: number[]; // last 7 sessions
  color: string; // CSS var name
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
  dailyGoal: number;
  todayQuestions: number;
  weeklyActivity: { day: string; count: number; date: string }[];
}

export interface TestCard {
  id: string;
  title: string;
  description: string;
  category: "naplan" | "selective" | "scholarship";
  subjects: string[];
  questionCount: number;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  yearLevels: number[];
  icon: string;
}

export const subjectProgress: SubjectProgress[] = [
  {
    subject: "maths",
    label: "Mathematics",
    questionsAttempted: 234,
    questionsCorrect: 187,
    accuracy: 80,
    trend: 5,
    recentScores: [72, 78, 75, 82, 80, 85, 80],
    color: "var(--subject-maths)",
  },
  {
    subject: "reading",
    label: "Reading",
    questionsAttempted: 156,
    questionsCorrect: 134,
    accuracy: 86,
    trend: 3,
    recentScores: [80, 82, 84, 83, 88, 85, 86],
    color: "var(--subject-reading)",
  },
  {
    subject: "writing",
    label: "Writing",
    questionsAttempted: 89,
    questionsCorrect: 62,
    accuracy: 70,
    trend: -2,
    recentScores: [65, 68, 72, 70, 68, 71, 70],
    color: "var(--subject-writing)",
  },
  {
    subject: "reasoning",
    label: "Reasoning",
    questionsAttempted: 178,
    questionsCorrect: 149,
    accuracy: 84,
    trend: 8,
    recentScores: [76, 78, 80, 82, 84, 83, 84],
    color: "var(--subject-reasoning)",
  },
  {
    subject: "conventions",
    label: "Conventions",
    questionsAttempted: 112,
    questionsCorrect: 95,
    accuracy: 85,
    trend: 1,
    recentScores: [82, 83, 84, 85, 84, 86, 85],
    color: "var(--subject-conventions)",
  },
];

export const streakData: StreakData = {
  currentStreak: 7,
  longestStreak: 14,
  todayCompleted: true,
  dailyGoal: 20,
  todayQuestions: 24,
  weeklyActivity: [
    { day: "Mon", count: 18, date: "2025-04-07" },
    { day: "Tue", count: 25, date: "2025-04-08" },
    { day: "Wed", count: 12, date: "2025-04-09" },
    { day: "Thu", count: 30, date: "2025-04-10" },
    { day: "Fri", count: 22, date: "2025-04-11" },
    { day: "Sat", count: 8, date: "2025-04-12" },
    { day: "Sun", count: 24, date: "2025-04-13" },
  ],
};

export const testCards: TestCard[] = [
  {
    id: "naplan-numeracy-all",
    title: "NAPLAN Numeracy",
    description: "Comprehensive practice with calculator and non-calculator sections",
    category: "naplan",
    subjects: ["Mathematics"],
    questionCount: 40,
    estimatedMinutes: 50,
    difficulty: 2,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "📐",
  },
  {
    id: "naplan-reading-all",
    title: "NAPLAN Reading",
    description: "Comprehension passages with multiple question types",
    category: "naplan",
    subjects: ["Reading"],
    questionCount: 35,
    estimatedMinutes: 45,
    difficulty: 2,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "📖",
  },
  {
    id: "naplan-conventions-all",
    title: "NAPLAN Language Conventions",
    description: "Spelling, grammar, and punctuation practice",
    category: "naplan",
    subjects: ["Conventions"],
    questionCount: 50,
    estimatedMinutes: 40,
    difficulty: 2,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "✍️",
  },
  {
    id: "selective-thinking",
    title: "Thinking Skills",
    description: "Abstract and verbal reasoning for selective entry",
    category: "selective",
    subjects: ["Reasoning"],
    questionCount: 30,
    estimatedMinutes: 40,
    difficulty: 4,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "🧠",
  },
  {
    id: "selective-maths",
    title: "Selective Maths",
    description: "Advanced problem-solving for selective school entry",
    category: "selective",
    subjects: ["Mathematics"],
    questionCount: 35,
    estimatedMinutes: 45,
    difficulty: 4,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "🔢",
  },
  {
    id: "scholarship-verbal",
    title: "ACER Verbal Reasoning",
    description: "Analogies, sequences, and comprehension for scholarship tests",
    category: "scholarship",
    subjects: ["Reasoning", "Reading"],
    questionCount: 25,
    estimatedMinutes: 30,
    difficulty: 3,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "💡",
  },
  {
    id: "scholarship-numerical",
    title: "ACER Numerical Reasoning",
    description: "Patterns, data interpretation, and problem solving",
    category: "scholarship",
    subjects: ["Mathematics"],
    questionCount: 25,
    estimatedMinutes: 35,
    difficulty: 3,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "📊",
  },
  {
    id: "scholarship-writing",
    title: "Scholarship Writing",
    description: "Persuasive and creative writing prompts",
    category: "scholarship",
    subjects: ["Writing"],
    questionCount: 3,
    estimatedMinutes: 45,
    difficulty: 3,
    yearLevels: [3, 4, 5, 6, 7, 8, 9],
    icon: "🖊️",
  },
];
