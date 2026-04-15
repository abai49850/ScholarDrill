export interface Question {
  id: string;
  content: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  topic: string;
  subtopic: string;
  yearLevel: number;
  timeLimitSeconds: number;
  subject: "maths" | "reading" | "writing" | "reasoning" | "conventions";
}

export const sampleQuestions: Question[] = [
  {
    id: "q1",
    content: "A rectangular garden has a length of 12 metres and a width of 8 metres. What is the perimeter of the garden?",
    options: [
      { id: "a", text: "20 metres" },
      { id: "b", text: "40 metres" },
      { id: "c", text: "96 metres" },
      { id: "d", text: "32 metres" },
    ],
    correctOptionId: "b",
    explanation: "The perimeter of a rectangle is calculated using the formula P = 2 × (length + width).\n\nP = 2 × (12 + 8)\nP = 2 × 20\nP = **40 metres**\n\nCommon mistake: Choosing 96 means you calculated the area (12 × 8 = 96) instead of the perimeter.",
    difficulty: 2,
    topic: "Measurement & Geometry",
    subtopic: "Perimeter",
    yearLevel: 5,
    timeLimitSeconds: 60,
    subject: "maths",
  },
  {
    id: "q2",
    content: "Which of the following sentences uses the correct punctuation?",
    options: [
      { id: "a", text: "The dog, chased the cat around the yard." },
      { id: "b", text: "The dog chased the cat, around the yard." },
      { id: "c", text: "The dog chased the cat around the yard." },
      { id: "d", text: "The dog chased, the cat around the yard." },
    ],
    correctOptionId: "c",
    explanation: "This is a simple sentence with a subject (the dog), a verb (chased), and a direct object (the cat around the yard). No commas are needed because there are no pauses, lists, or subordinate clauses.",
    difficulty: 1,
    topic: "Language Conventions",
    subtopic: "Punctuation",
    yearLevel: 5,
    timeLimitSeconds: 45,
    subject: "conventions",
  },
  {
    id: "q3",
    content: "A shop sells notebooks for $4.50 each. Emma buys 6 notebooks and pays with a $50 note. How much change does she receive?",
    options: [
      { id: "a", text: "$23.00" },
      { id: "b", text: "$27.00" },
      { id: "c", text: "$22.00" },
      { id: "d", text: "$23.50" },
    ],
    correctOptionId: "a",
    explanation: "Step 1: Calculate total cost.\n6 × $4.50 = $27.00\n\nStep 2: Calculate change.\n$50.00 − $27.00 = **$23.00**",
    difficulty: 2,
    topic: "Number & Algebra",
    subtopic: "Money",
    yearLevel: 5,
    timeLimitSeconds: 90,
    subject: "maths",
  },
  {
    id: "q4",
    content: "Read the passage:\n\n*\"The platypus is one of only five species of monotremes — mammals that lay eggs. Found exclusively in eastern Australia, this remarkable creature has a bill like a duck, a tail like a beaver, and venomous spurs on its hind legs.\"*\n\nWhat does the word 'exclusively' mean in this passage?",
    options: [
      { id: "a", text: "Rarely" },
      { id: "b", text: "Only" },
      { id: "c", text: "Sometimes" },
      { id: "d", text: "Previously" },
    ],
    correctOptionId: "b",
    explanation: "'Exclusively' means 'only' or 'solely'. The passage states that the platypus is found exclusively in eastern Australia, meaning it is found **only** in eastern Australia and nowhere else in the world.",
    difficulty: 2,
    topic: "Reading Comprehension",
    subtopic: "Vocabulary in Context",
    yearLevel: 5,
    timeLimitSeconds: 60,
    subject: "reading",
  },
  {
    id: "q5",
    content: "What is 3/4 of 240?",
    options: [
      { id: "a", text: "60" },
      { id: "b", text: "120" },
      { id: "c", text: "180" },
      { id: "d", text: "200" },
    ],
    correctOptionId: "c",
    explanation: "To find 3/4 of 240:\n\nStep 1: Find 1/4 of 240.\n240 ÷ 4 = 60\n\nStep 2: Multiply by 3.\n60 × 3 = **180**",
    difficulty: 3,
    topic: "Number & Algebra",
    subtopic: "Fractions",
    yearLevel: 5,
    timeLimitSeconds: 60,
    subject: "maths",
  },
  {
    id: "q6",
    content: "Look at this number pattern: 2, 6, 18, 54, ...\n\nWhat is the next number in the pattern?",
    options: [
      { id: "a", text: "108" },
      { id: "b", text: "162" },
      { id: "c", text: "72" },
      { id: "d", text: "216" },
    ],
    correctOptionId: "b",
    explanation: "Each number in the pattern is multiplied by 3 to get the next number:\n\n2 × 3 = 6\n6 × 3 = 18\n18 × 3 = 54\n54 × 3 = **162**\n\nThis is a geometric sequence with a common ratio of 3.",
    difficulty: 3,
    topic: "Number & Algebra",
    subtopic: "Patterns",
    yearLevel: 5,
    timeLimitSeconds: 60,
    subject: "maths",
  },
  {
    id: "q7",
    content: "If it is 2:45 PM now, what time will it be in 3 hours and 25 minutes?",
    options: [
      { id: "a", text: "5:10 PM" },
      { id: "b", text: "6:10 PM" },
      { id: "c", text: "5:70 PM" },
      { id: "d", text: "6:00 PM" },
    ],
    correctOptionId: "b",
    explanation: "Start: 2:45 PM\n\nAdd 3 hours → 5:45 PM\nAdd 25 minutes → 5:45 + 25 = 6:10 PM\n\n45 + 25 = 70 minutes = 1 hour and 10 minutes, so 5:45 + 0:25 = **6:10 PM**",
    difficulty: 3,
    topic: "Measurement & Geometry",
    subtopic: "Time",
    yearLevel: 5,
    timeLimitSeconds: 75,
    subject: "maths",
  },
  {
    id: "q8",
    content: "Which word best completes this analogy?\n\nHot is to cold as fast is to ___",
    options: [
      { id: "a", text: "quick" },
      { id: "b", text: "speedy" },
      { id: "c", text: "slow" },
      { id: "d", text: "running" },
    ],
    correctOptionId: "c",
    explanation: "'Hot' and 'cold' are antonyms (opposites). Following the same pattern, the antonym of 'fast' is **'slow'**.\n\n'Quick' and 'speedy' are synonyms of 'fast', not opposites. 'Running' is related but not an antonym.",
    difficulty: 1,
    topic: "Verbal Reasoning",
    subtopic: "Analogies",
    yearLevel: 5,
    timeLimitSeconds: 45,
    subject: "reasoning",
  },
  {
    id: "q9",
    content: "A survey asked 120 students about their favourite sport. 35% chose cricket. How many students chose cricket?",
    options: [
      { id: "a", text: "35" },
      { id: "b", text: "42" },
      { id: "c", text: "38" },
      { id: "d", text: "45" },
    ],
    correctOptionId: "b",
    explanation: "To find 35% of 120:\n\n35% = 35/100 = 0.35\n\n0.35 × 120 = **42 students**\n\nAlternatively: 10% of 120 = 12, so 30% = 36 and 5% = 6, giving 36 + 6 = 42.",
    difficulty: 4,
    topic: "Statistics & Probability",
    subtopic: "Percentages",
    yearLevel: 7,
    timeLimitSeconds: 90,
    subject: "maths",
  },
  {
    id: "q10",
    content: "A cube has a side length of 5 cm. What is the total surface area of the cube?",
    options: [
      { id: "a", text: "25 cm²" },
      { id: "b", text: "125 cm³" },
      { id: "c", text: "150 cm²" },
      { id: "d", text: "30 cm²" },
    ],
    correctOptionId: "c",
    explanation: "A cube has 6 faces, each being a square.\n\nArea of one face = 5 × 5 = 25 cm²\nTotal surface area = 6 × 25 = **150 cm²**\n\nCommon mistake: 125 cm³ is the volume (5³), not the surface area.",
    difficulty: 4,
    topic: "Measurement & Geometry",
    subtopic: "Surface Area",
    yearLevel: 7,
    timeLimitSeconds: 75,
    subject: "maths",
  },
];

// Adaptive difficulty engine
export function getNextDifficulty(recentResults: boolean[], currentDifficulty: number): number {
  if (recentResults.length < 3) return currentDifficulty;
  
  const last5 = recentResults.slice(-5);
  const correctRate = last5.filter(Boolean).length / last5.length;
  
  if (correctRate >= 0.8 && currentDifficulty < 5) return currentDifficulty + 1;
  if (correctRate <= 0.4 && currentDifficulty > 1) return currentDifficulty - 1;
  return currentDifficulty;
}

export function selectQuestion(
  questions: Question[],
  targetDifficulty: number,
  answeredIds: Set<string>
): Question | null {
  const available = questions.filter((q) => !answeredIds.has(q.id));
  if (available.length === 0) return null;

  // Prefer questions close to target difficulty
  const sorted = [...available].sort(
    (a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
  );
  return sorted[0];
}
