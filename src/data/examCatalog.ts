import type { QuestionExamType, QuestionSubject } from "@/lib/questionsApi";

export type ExamCategory = "naplan" | "icas" | "selective" | "scholarship" | "senior";

export interface ExamSection {
  name: string;
  subject: QuestionSubject;
  questionLabel: string;
  minutes: number;
  focus: string;
}

export interface ExamCard {
  id: string;
  title: string;
  description: string;
  category: ExamCategory;
  dbExamType: QuestionExamType;
  subjects: QuestionSubject[];
  questionCount: number;
  questionCountLabel: string;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  yearLevels: number[];
  icon: string;
  sourceLabel: string;
  sourceUrl: string;
  sections: ExamSection[];
}

export const examCategories: { key: "all" | ExamCategory; label: string }[] = [
  { key: "all", label: "All Tests" },
  { key: "naplan", label: "NAPLAN" },
  { key: "icas", label: "ICAS" },
  { key: "selective", label: "Selective" },
  { key: "scholarship", label: "ACER / EduTest" },
  { key: "senior", label: "VCE / HSC" },
];

export const examCards: ExamCard[] = [
  {
    id: "naplan-numeracy",
    title: "NAPLAN Numeracy",
    description: "Number, algebra, measurement, space, statistics and probability practice.",
    category: "naplan",
    dbExamType: "naplan",
    subjects: ["maths"],
    questionCount: 40,
    questionCountLabel: "about 40 questions",
    estimatedMinutes: 50,
    difficulty: 2,
    yearLevels: [3, 5, 7, 9],
    icon: "N",
    sourceLabel: "ACARA NAPLAN domain format",
    sourceUrl: "https://www.nap.edu.au/naplan",
    sections: [
      { name: "Numeracy", subject: "maths", questionLabel: "about 40 questions", minutes: 50, focus: "Calculator and non-calculator style numeracy" },
    ],
  },
  {
    id: "naplan-reading",
    title: "NAPLAN Reading",
    description: "Comprehension, inference, vocabulary and text purpose questions.",
    category: "naplan",
    dbExamType: "naplan",
    subjects: ["reading"],
    questionCount: 35,
    questionCountLabel: "about 35 questions",
    estimatedMinutes: 45,
    difficulty: 2,
    yearLevels: [3, 5, 7, 9],
    icon: "R",
    sourceLabel: "ACARA NAPLAN reading domain",
    sourceUrl: "https://www.nap.edu.au/naplan",
    sections: [
      { name: "Reading", subject: "reading", questionLabel: "about 35 questions", minutes: 45, focus: "Text comprehension and interpretation" },
    ],
  },
  {
    id: "naplan-conventions",
    title: "NAPLAN Language Conventions",
    description: "Spelling, grammar, punctuation and sentence-level editing.",
    category: "naplan",
    dbExamType: "naplan",
    subjects: ["conventions"],
    questionCount: 50,
    questionCountLabel: "about 50 questions",
    estimatedMinutes: 40,
    difficulty: 2,
    yearLevels: [3, 5, 7, 9],
    icon: "L",
    sourceLabel: "ACARA NAPLAN conventions domain",
    sourceUrl: "https://www.nap.edu.au/naplan",
    sections: [
      { name: "Conventions", subject: "conventions", questionLabel: "about 50 questions", minutes: 40, focus: "Spelling, grammar and punctuation" },
    ],
  },
  {
    id: "icas-english",
    title: "ICAS English",
    description: "Higher-order reading, vocabulary and language questions for ICAS English.",
    category: "icas",
    dbExamType: "general",
    subjects: ["reading", "conventions"],
    questionCount: 50,
    questionCountLabel: "35-55 questions by paper",
    estimatedMinutes: 55,
    difficulty: 4,
    yearLevels: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    icon: "I",
    sourceLabel: "ICAS English question/time table",
    sourceUrl: "https://www.icasassessments.com/icas-year-levels-and-exam-papers/",
    sections: [
      { name: "English", subject: "reading", questionLabel: "35-55 questions", minutes: 55, focus: "Reading, vocabulary and language use" },
      { name: "Language", subject: "conventions", questionLabel: "embedded items", minutes: 55, focus: "Grammar and precise expression" },
    ],
  },
  {
    id: "icas-mathematics",
    title: "ICAS Mathematics",
    description: "Problem solving and mathematical reasoning for ICAS Mathematics papers.",
    category: "icas",
    dbExamType: "general",
    subjects: ["maths", "reasoning"],
    questionCount: 40,
    questionCountLabel: "30-40 questions by paper",
    estimatedMinutes: 60,
    difficulty: 4,
    yearLevels: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    icon: "M",
    sourceLabel: "ICAS Mathematics question/time table",
    sourceUrl: "https://www.icasassessments.com/icas-year-levels-and-exam-papers/",
    sections: [
      { name: "Mathematics", subject: "maths", questionLabel: "30-40 questions", minutes: 60, focus: "Problem solving and mathematical reasoning" },
    ],
  },
  {
    id: "icas-writing",
    title: "ICAS Writing",
    description: "Timed written response practice with planning and structure prompts.",
    category: "icas",
    dbExamType: "general",
    subjects: ["writing"],
    questionCount: 1,
    questionCountLabel: "1 writing task",
    estimatedMinutes: 35,
    difficulty: 4,
    yearLevels: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    icon: "W",
    sourceLabel: "ICAS Writing paper table",
    sourceUrl: "https://www.icasassessments.com/icas-year-levels-and-exam-papers/",
    sections: [
      { name: "Writing", subject: "writing", questionLabel: "1 task", minutes: 35, focus: "Creative, persuasive or informative response" },
    ],
  },
  {
    id: "nsw-selective-reading",
    title: "NSW Selective Reading",
    description: "Reading section practice for NSW Year 7 selective high school entry.",
    category: "selective",
    dbExamType: "selective",
    subjects: ["reading"],
    questionCount: 30,
    questionCountLabel: "about 30 questions",
    estimatedMinutes: 45,
    difficulty: 4,
    yearLevels: [5, 6],
    icon: "NSW",
    sourceLabel: "NSW selective placement test",
    sourceUrl: "https://education.nsw.gov.au/schooling/parents-and-carers/choosing-a-school-setting/selective-high-schools/placement-test",
    sections: [
      { name: "Reading", subject: "reading", questionLabel: "about 30 questions", minutes: 45, focus: "Comprehension and comparison of texts" },
    ],
  },
  {
    id: "nsw-selective-maths",
    title: "NSW Selective Mathematical Reasoning",
    description: "Timed NSW-style maths reasoning and multi-step problem solving.",
    category: "selective",
    dbExamType: "selective",
    subjects: ["maths"],
    questionCount: 35,
    questionCountLabel: "35 questions",
    estimatedMinutes: 40,
    difficulty: 4,
    yearLevels: [5, 6],
    icon: "NSW",
    sourceLabel: "NSW selective placement test",
    sourceUrl: "https://education.nsw.gov.au/schooling/parents-and-carers/choosing-a-school-setting/selective-high-schools/placement-test",
    sections: [
      { name: "Mathematical Reasoning", subject: "maths", questionLabel: "35 questions", minutes: 40, focus: "Mathematical reasoning and problem solving" },
    ],
  },
  {
    id: "nsw-selective-thinking",
    title: "NSW Selective Thinking Skills",
    description: "Logic, verbal reasoning, pattern and problem-solving practice.",
    category: "selective",
    dbExamType: "selective",
    subjects: ["reasoning"],
    questionCount: 40,
    questionCountLabel: "40 questions",
    estimatedMinutes: 40,
    difficulty: 5,
    yearLevels: [5, 6],
    icon: "NSW",
    sourceLabel: "NSW selective placement test",
    sourceUrl: "https://education.nsw.gov.au/schooling/parents-and-carers/choosing-a-school-setting/selective-high-schools/placement-test",
    sections: [
      { name: "Thinking Skills", subject: "reasoning", questionLabel: "40 questions", minutes: 40, focus: "Logical and critical reasoning" },
    ],
  },
  {
    id: "vic-sehs-acer",
    title: "VIC Selective Entry ACER",
    description: "Victorian SEHS practice across maths, quantitative, reading, verbal and writing tasks.",
    category: "selective",
    dbExamType: "selective",
    subjects: ["maths", "reasoning", "reading", "writing"],
    questionCount: 3,
    questionCountLabel: "3 timed blocks",
    estimatedMinutes: 155,
    difficulty: 5,
    yearLevels: [8, 9],
    icon: "VIC",
    sourceLabel: "ACER Victorian SEHS format",
    sourceUrl: "https://selectiveentry.acer.org/vic/prepare",
    sections: [
      { name: "Mathematics and Quantitative Reasoning", subject: "maths", questionLabel: "mixed MCQ block", minutes: 60, focus: "Maths plus number, pattern and shape reasoning" },
      { name: "Reading and Verbal Reasoning", subject: "reading", questionLabel: "mixed MCQ block", minutes: 55, focus: "Text interpretation and word-based logic" },
      { name: "Writing", subject: "writing", questionLabel: "2 writing tasks", minutes: 40, focus: "Precise, coherent written responses" },
    ],
  },
  {
    id: "acer-scholarship-humanities",
    title: "ACER Scholarship Humanities",
    description: "Reading, visual interpretation and humanities-style ACER scholarship practice.",
    category: "scholarship",
    dbExamType: "scholarship",
    subjects: ["reading", "reasoning"],
    questionCount: 40,
    questionCountLabel: "MCQ section",
    estimatedMinutes: 40,
    difficulty: 4,
    yearLevels: [6, 7, 8, 9, 10, 11, 12],
    icon: "ACER",
    sourceLabel: "ACER Scholarship Tests",
    sourceUrl: "https://www.acer.org/in/scholarship",
    sections: [
      { name: "Humanities", subject: "reading", questionLabel: "MCQ section", minutes: 40, focus: "Written and visual source interpretation" },
    ],
  },
  {
    id: "acer-scholarship-mathematics",
    title: "ACER Scholarship Mathematics",
    description: "ACER scholarship mathematics and science reasoning style practice.",
    category: "scholarship",
    dbExamType: "scholarship",
    subjects: ["maths", "reasoning"],
    questionCount: 40,
    questionCountLabel: "MCQ section",
    estimatedMinutes: 40,
    difficulty: 4,
    yearLevels: [6, 7, 8, 9, 10, 11, 12],
    icon: "ACER",
    sourceLabel: "ACER Scholarship Tests",
    sourceUrl: "https://www.acer.org/in/scholarship",
    sections: [
      { name: "Mathematics", subject: "maths", questionLabel: "MCQ section", minutes: 40, focus: "Mathematics, science and reasoning" },
    ],
  },
  {
    id: "edutest-ability",
    title: "EduTest Ability Tests",
    description: "Verbal and numerical reasoning for EduTest scholarship and entrance exams.",
    category: "scholarship",
    dbExamType: "scholarship",
    subjects: ["reasoning", "maths"],
    questionCount: 2,
    questionCountLabel: "2 x 30 min MCQ tests",
    estimatedMinutes: 60,
    difficulty: 4,
    yearLevels: [4, 5, 6, 7, 8, 9, 10],
    icon: "EDU",
    sourceLabel: "EduTest parent test information",
    sourceUrl: "https://www.edutest.com.au/tests_parents.html",
    sections: [
      { name: "Verbal Reasoning", subject: "reasoning", questionLabel: "MCQ section", minutes: 30, focus: "Vocabulary, word relationships and deduction" },
      { name: "Numerical Reasoning", subject: "maths", questionLabel: "MCQ section", minutes: 30, focus: "Series, matrices and arithmetical reasoning" },
    ],
  },
  {
    id: "edutest-achievement",
    title: "EduTest Achievement Tests",
    description: "Reading, mathematics and written expression for EduTest school entry.",
    category: "scholarship",
    dbExamType: "scholarship",
    subjects: ["reading", "maths", "writing"],
    questionCount: 3,
    questionCountLabel: "2 x 30 min MCQ + 15 min writing",
    estimatedMinutes: 75,
    difficulty: 4,
    yearLevels: [4, 5, 6, 7, 8, 9, 10],
    icon: "EDU",
    sourceLabel: "EduTest parent test information",
    sourceUrl: "https://www.edutest.com.au/tests_parents.html",
    sections: [
      { name: "Reading Comprehension", subject: "reading", questionLabel: "MCQ section", minutes: 30, focus: "Interpreting passages and language" },
      { name: "Mathematics", subject: "maths", questionLabel: "MCQ section", minutes: 30, focus: "Year-level mathematics across key strands" },
      { name: "Written Expression", subject: "writing", questionLabel: "1 writing task", minutes: 15, focus: "Creative, descriptive, persuasive or informative writing" },
    ],
  },
  {
    id: "hsc-english",
    title: "HSC English Skills",
    description: "NSW senior English practice for unseen texts, modules and extended responses.",
    category: "senior",
    dbExamType: "general",
    subjects: ["reading", "writing", "conventions"],
    questionCount: 3,
    questionCountLabel: "Paper 1 + Paper 2 skills",
    estimatedMinutes: 210,
    difficulty: 5,
    yearLevels: [11, 12],
    icon: "HSC",
    sourceLabel: "NESA HSC English exam packs",
    sourceUrl: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/english-standard",
    sections: [
      { name: "Paper 1 - Texts and Human Experiences", subject: "reading", questionLabel: "short answers + extended response", minutes: 90, focus: "Unseen texts and common module response" },
      { name: "Paper 2 - Modules", subject: "writing", questionLabel: "3 module responses", minutes: 120, focus: "Analytical extended responses" },
    ],
  },
  {
    id: "vce-english",
    title: "VCE English Skills",
    description: "Victorian senior English practice for text analysis and argument analysis.",
    category: "senior",
    dbExamType: "general",
    subjects: ["reading", "writing", "conventions"],
    questionCount: 2,
    questionCountLabel: "written examination skills",
    estimatedMinutes: 180,
    difficulty: 5,
    yearLevels: [11, 12],
    icon: "VCE",
    sourceLabel: "VCAA examination specifications",
    sourceUrl: "https://vcaa.vic.edu.au/assessment/vce/examination-specifications-past-examinations-and-examination-reports/examination-specifications-past-examinations-and-external-assessment-reports",
    sections: [
      { name: "Text Response", subject: "writing", questionLabel: "extended response", minutes: 90, focus: "Analytical response to a studied text" },
      { name: "Argument Analysis", subject: "reading", questionLabel: "extended response", minutes: 90, focus: "Analysis of argument and persuasive language" },
    ],
  },
];

export function getExamCard(id: string | null | undefined) {
  if (!id) return undefined;
  return examCards.find((card) => card.id === id);
}
