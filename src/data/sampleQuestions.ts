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

// ── MATHS ──────────────────────────────────────────────
const mathsQuestions: Question[] = [
  {
    id: "m1",
    content: "A rectangular garden has a length of 12 metres and a width of 8 metres. What is the perimeter of the garden?",
    options: [
      { id: "a", text: "20 metres" },
      { id: "b", text: "40 metres" },
      { id: "c", text: "96 metres" },
      { id: "d", text: "32 metres" },
    ],
    correctOptionId: "b",
    explanation: "The perimeter of a rectangle = 2 × (length + width).\n\nP = 2 × (12 + 8) = 2 × 20 = 40 metres.\n\nCommon mistake: 96 is the area (12 × 8), not the perimeter.",
    difficulty: 2, topic: "Measurement & Geometry", subtopic: "Perimeter", yearLevel: 5, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "m2",
    content: "A shop sells notebooks for $4.50 each. Emma buys 6 notebooks and pays with a $50 note. How much change does she receive?",
    options: [
      { id: "a", text: "$23.00" },
      { id: "b", text: "$27.00" },
      { id: "c", text: "$22.00" },
      { id: "d", text: "$23.50" },
    ],
    correctOptionId: "a",
    explanation: "Total cost: 6 × $4.50 = $27.00\nChange: $50.00 − $27.00 = $23.00",
    difficulty: 2, topic: "Number & Algebra", subtopic: "Money", yearLevel: 5, timeLimitSeconds: 90, subject: "maths",
  },
  {
    id: "m3",
    content: "What is 3/4 of 240?",
    options: [
      { id: "a", text: "60" },
      { id: "b", text: "120" },
      { id: "c", text: "180" },
      { id: "d", text: "200" },
    ],
    correctOptionId: "c",
    explanation: "1/4 of 240 = 60. Then 3 × 60 = 180.",
    difficulty: 3, topic: "Number & Algebra", subtopic: "Fractions", yearLevel: 5, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "m4",
    content: "Look at this number pattern: 2, 6, 18, 54, ...\n\nWhat is the next number in the pattern?",
    options: [
      { id: "a", text: "108" },
      { id: "b", text: "162" },
      { id: "c", text: "72" },
      { id: "d", text: "216" },
    ],
    correctOptionId: "b",
    explanation: "Each number is multiplied by 3: 2→6→18→54→162. This is a geometric sequence with ratio 3.",
    difficulty: 3, topic: "Number & Algebra", subtopic: "Patterns", yearLevel: 5, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "m5",
    content: "If it is 2:45 PM now, what time will it be in 3 hours and 25 minutes?",
    options: [
      { id: "a", text: "5:10 PM" },
      { id: "b", text: "6:10 PM" },
      { id: "c", text: "5:70 PM" },
      { id: "d", text: "6:00 PM" },
    ],
    correctOptionId: "b",
    explanation: "2:45 + 3 hours = 5:45. Then 5:45 + 25 min = 6:10 PM (45 + 25 = 70 min = 1 hr 10 min).",
    difficulty: 3, topic: "Measurement & Geometry", subtopic: "Time", yearLevel: 5, timeLimitSeconds: 75, subject: "maths",
  },
  {
    id: "m6",
    content: "A survey asked 120 students about their favourite sport. 35% chose cricket. How many students chose cricket?",
    options: [
      { id: "a", text: "35" },
      { id: "b", text: "42" },
      { id: "c", text: "38" },
      { id: "d", text: "45" },
    ],
    correctOptionId: "b",
    explanation: "35% of 120 = 0.35 × 120 = 42 students.",
    difficulty: 4, topic: "Statistics & Probability", subtopic: "Percentages", yearLevel: 7, timeLimitSeconds: 90, subject: "maths",
  },
  {
    id: "m7",
    content: "A cube has a side length of 5 cm. What is the total surface area of the cube?",
    options: [
      { id: "a", text: "25 cm²" },
      { id: "b", text: "125 cm³" },
      { id: "c", text: "150 cm²" },
      { id: "d", text: "30 cm²" },
    ],
    correctOptionId: "c",
    explanation: "A cube has 6 faces. Each face = 5 × 5 = 25 cm². Total = 6 × 25 = 150 cm².\n\n125 cm³ is the volume, not the surface area.",
    difficulty: 4, topic: "Measurement & Geometry", subtopic: "Surface Area", yearLevel: 7, timeLimitSeconds: 75, subject: "maths",
  },
  {
    id: "m8",
    content: "Simplify: 2(3x + 4) − 5x",
    options: [
      { id: "a", text: "x + 8" },
      { id: "b", text: "x + 4" },
      { id: "c", text: "11x + 8" },
      { id: "d", text: "6x + 8 − 5x" },
    ],
    correctOptionId: "a",
    explanation: "Expand: 2(3x + 4) = 6x + 8. Then 6x + 8 − 5x = x + 8.",
    difficulty: 4, topic: "Number & Algebra", subtopic: "Algebraic Expressions", yearLevel: 7, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "m9",
    content: "A triangle has angles measuring 55° and 70°. What is the third angle?",
    options: [
      { id: "a", text: "65°" },
      { id: "b", text: "55°" },
      { id: "c", text: "45°" },
      { id: "d", text: "125°" },
    ],
    correctOptionId: "b",
    explanation: "Angles in a triangle sum to 180°. Third angle = 180 − 55 − 70 = 55°.",
    difficulty: 2, topic: "Measurement & Geometry", subtopic: "Angles", yearLevel: 5, timeLimitSeconds: 45, subject: "maths",
  },
  {
    id: "m10",
    content: "What is the probability of rolling an even number on a standard six-sided die?",
    options: [
      { id: "a", text: "1/6" },
      { id: "b", text: "1/3" },
      { id: "c", text: "1/2" },
      { id: "d", text: "2/3" },
    ],
    correctOptionId: "c",
    explanation: "Even numbers: 2, 4, 6 → 3 outcomes out of 6 total = 3/6 = 1/2.",
    difficulty: 1, topic: "Statistics & Probability", subtopic: "Probability", yearLevel: 5, timeLimitSeconds: 45, subject: "maths",
  },
];

// ── READING ────────────────────────────────────────────
const readingQuestions: Question[] = [
  {
    id: "r1",
    content: "Read the passage:\n\n\"The platypus is one of only five species of monotremes — mammals that lay eggs. Found exclusively in eastern Australia, this remarkable creature has a bill like a duck, a tail like a beaver, and venomous spurs on its hind legs.\"\n\nWhat does the word 'exclusively' mean in this passage?",
    options: [
      { id: "a", text: "Rarely" },
      { id: "b", text: "Only" },
      { id: "c", text: "Sometimes" },
      { id: "d", text: "Previously" },
    ],
    correctOptionId: "b",
    explanation: "'Exclusively' means 'only' or 'solely'. The platypus is found only in eastern Australia.",
    difficulty: 2, topic: "Reading Comprehension", subtopic: "Vocabulary in Context", yearLevel: 5, timeLimitSeconds: 60, subject: "reading",
  },
  {
    id: "r2",
    content: "Read the passage:\n\n\"Sarah stared at the trophy on the mantelpiece, its golden surface dulled by years of dust. She remembered the day she'd won it — the crowd cheering, her coach lifting her into the air. Now the house was quiet, and the memories felt like they belonged to someone else.\"\n\nWhat mood does this passage create?",
    options: [
      { id: "a", text: "Excitement and joy" },
      { id: "b", text: "Anger and frustration" },
      { id: "c", text: "Nostalgia and melancholy" },
      { id: "d", text: "Fear and suspense" },
    ],
    correctOptionId: "c",
    explanation: "The passage contrasts a joyful past memory with the quiet, dusty present. Words like 'dulled', 'quiet', and 'belonged to someone else' create a nostalgic and melancholy mood.",
    difficulty: 3, topic: "Reading Comprehension", subtopic: "Mood & Tone", yearLevel: 7, timeLimitSeconds: 90, subject: "reading",
  },
  {
    id: "r3",
    content: "Read the passage:\n\n\"The Great Barrier Reef stretches over 2,300 kilometres along Australia's northeast coast. It supports an extraordinary diversity of life, including over 1,500 species of fish, 400 types of coral, and 4,000 species of mollusc.\"\n\nWhat is the author's main purpose?",
    options: [
      { id: "a", text: "To persuade readers to visit the reef" },
      { id: "b", text: "To inform readers about the reef's biodiversity" },
      { id: "c", text: "To entertain with a story about the reef" },
      { id: "d", text: "To argue for reef conservation" },
    ],
    correctOptionId: "b",
    explanation: "The passage presents factual information and statistics about the reef's biodiversity. It doesn't persuade, entertain, or argue — it informs.",
    difficulty: 2, topic: "Reading Comprehension", subtopic: "Author's Purpose", yearLevel: 5, timeLimitSeconds: 60, subject: "reading",
  },
  {
    id: "r4",
    content: "Read the passage:\n\n\"Unlike her sister, who bounded into every room with infectious energy, Maya preferred to observe from the doorway before deciding whether a room — and its people — were worth entering.\"\n\nWhat can you infer about Maya?",
    options: [
      { id: "a", text: "She is shy and unfriendly" },
      { id: "b", text: "She is cautious and thoughtful" },
      { id: "c", text: "She dislikes her sister" },
      { id: "d", text: "She is afraid of people" },
    ],
    correctOptionId: "b",
    explanation: "Maya 'preferred to observe' and 'decide' before acting — this suggests she is cautious and thoughtful, not necessarily shy or afraid.",
    difficulty: 3, topic: "Reading Comprehension", subtopic: "Inference", yearLevel: 7, timeLimitSeconds: 75, subject: "reading",
  },
  {
    id: "r5",
    content: "Read the passage:\n\n\"The wind howled through the empty streets, rattling shutters and sending newspapers spiralling into the grey sky.\"\n\nWhich literary technique is used in 'the wind howled'?",
    options: [
      { id: "a", text: "Simile" },
      { id: "b", text: "Metaphor" },
      { id: "c", text: "Personification" },
      { id: "d", text: "Alliteration" },
    ],
    correctOptionId: "c",
    explanation: "Personification gives human qualities to non-human things. Wind cannot literally 'howl' — that's a sound made by animals or people.",
    difficulty: 2, topic: "Reading Comprehension", subtopic: "Literary Techniques", yearLevel: 5, timeLimitSeconds: 45, subject: "reading",
  },
  {
    id: "r6",
    content: "Read the passage:\n\n\"First, the caterpillar forms a chrysalis. Inside, its body breaks down almost entirely into a kind of soup. Then, over two weeks, new cells organise into wings, legs, and antennae. Finally, a butterfly emerges.\"\n\nWhat text structure is used?",
    options: [
      { id: "a", text: "Cause and effect" },
      { id: "b", text: "Compare and contrast" },
      { id: "c", text: "Chronological / sequence" },
      { id: "d", text: "Problem and solution" },
    ],
    correctOptionId: "c",
    explanation: "Signal words 'First', 'Then', 'Finally' indicate a chronological or sequential text structure.",
    difficulty: 2, topic: "Reading Comprehension", subtopic: "Text Structure", yearLevel: 5, timeLimitSeconds: 60, subject: "reading",
  },
  {
    id: "r7",
    content: "Read the poem:\n\n\"I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils.\"\n\nWhat does 'lonely as a cloud' compare?",
    options: [
      { id: "a", text: "The speaker's speed to a cloud" },
      { id: "b", text: "The speaker's isolation to a single drifting cloud" },
      { id: "c", text: "The daffodils to clouds" },
      { id: "d", text: "The hills to clouds" },
    ],
    correctOptionId: "b",
    explanation: "This simile compares the speaker's solitary wandering to a single cloud drifting alone in the sky.",
    difficulty: 3, topic: "Reading Comprehension", subtopic: "Poetry Analysis", yearLevel: 7, timeLimitSeconds: 75, subject: "reading",
  },
  {
    id: "r8",
    content: "A book's back cover says: \"When 12-year-old Mia discovers a map hidden in her grandmother's attic, she's plunged into a race against time to find a lost family treasure before a ruthless collector gets there first.\"\n\nWhat genre is this book most likely?",
    options: [
      { id: "a", text: "Biography" },
      { id: "b", text: "Science fiction" },
      { id: "c", text: "Adventure" },
      { id: "d", text: "Historical non-fiction" },
    ],
    correctOptionId: "c",
    explanation: "A hidden map, a race against time, and a treasure hunt are hallmarks of the adventure genre.",
    difficulty: 1, topic: "Reading Comprehension", subtopic: "Genre", yearLevel: 5, timeLimitSeconds: 45, subject: "reading",
  },
  {
    id: "r9",
    content: "Read the passage:\n\n\"According to the Bureau of Meteorology, 2024 was Australia's warmest year on record. Average temperatures were 1.3°C above the historical mean. However, some scientists caution that a single year's data should not be used to draw long-term conclusions.\"\n\nWhat word signals a contrasting viewpoint?",
    options: [
      { id: "a", text: "According" },
      { id: "b", text: "Average" },
      { id: "c", text: "However" },
      { id: "d", text: "Record" },
    ],
    correctOptionId: "c",
    explanation: "'However' is a conjunctive adverb that introduces a contrasting or opposing idea.",
    difficulty: 3, topic: "Reading Comprehension", subtopic: "Connectives & Cohesion", yearLevel: 7, timeLimitSeconds: 60, subject: "reading",
  },
  {
    id: "r10",
    content: "An article's headline reads: \"Local Hero Saves Drowning Puppy from Raging River\"\n\nWhich word in the headline is most clearly an example of emotive language?",
    options: [
      { id: "a", text: "Local" },
      { id: "b", text: "Hero" },
      { id: "c", text: "Drowning" },
      { id: "d", text: "River" },
    ],
    correctOptionId: "b",
    explanation: "'Hero' is emotive — it frames the person positively and stirs admiration. 'Local' and 'River' are neutral; 'Drowning' is descriptive but 'Hero' is the most clearly value-laden.",
    difficulty: 4, topic: "Reading Comprehension", subtopic: "Persuasive Language", yearLevel: 7, timeLimitSeconds: 60, subject: "reading",
  },
];

// ── WRITING ────────────────────────────────────────────
const writingQuestions: Question[] = [
  {
    id: "w1",
    content: "Which sentence is the strongest opening for a persuasive essay about banning plastic bags?",
    options: [
      { id: "a", text: "Plastic bags are bad for the environment." },
      { id: "b", text: "Every year, over 8 million tonnes of plastic choke our oceans — and single-use bags are one of the worst offenders." },
      { id: "c", text: "This essay is about why we should ban plastic bags." },
      { id: "d", text: "I think plastic bags should be banned." },
    ],
    correctOptionId: "b",
    explanation: "Option B uses a powerful statistic and emotive language ('choke our oceans') to hook the reader. The others are too vague, personal, or tell rather than show.",
    difficulty: 3, topic: "Writing", subtopic: "Persuasive Openings", yearLevel: 7, timeLimitSeconds: 75, subject: "writing",
  },
  {
    id: "w2",
    content: "Which sentence uses a more vivid verb to replace 'walked'?\n\nOriginal: \"She walked through the dark forest.\"",
    options: [
      { id: "a", text: "She went through the dark forest." },
      { id: "b", text: "She crept through the dark forest." },
      { id: "c", text: "She moved through the dark forest." },
      { id: "d", text: "She was walking through the dark forest." },
    ],
    correctOptionId: "b",
    explanation: "'Crept' is a vivid, precise verb that conveys cautiousness and tension — much stronger than generic verbs like 'went' or 'moved'.",
    difficulty: 2, topic: "Writing", subtopic: "Word Choice", yearLevel: 5, timeLimitSeconds: 45, subject: "writing",
  },
  {
    id: "w3",
    content: "What is the correct order for a standard essay paragraph?\n\n1. Supporting evidence\n2. Topic sentence\n3. Concluding/linking sentence\n4. Explanation of evidence",
    options: [
      { id: "a", text: "2, 1, 4, 3" },
      { id: "b", text: "1, 2, 3, 4" },
      { id: "c", text: "2, 4, 1, 3" },
      { id: "d", text: "3, 2, 1, 4" },
    ],
    correctOptionId: "a",
    explanation: "The TEEL structure: Topic sentence → Evidence → Explanation → Linking sentence. This is the standard Australian essay paragraph format.",
    difficulty: 2, topic: "Writing", subtopic: "Paragraph Structure", yearLevel: 5, timeLimitSeconds: 60, subject: "writing",
  },
  {
    id: "w4",
    content: "Which sentence best shows 'show, don't tell' for the idea 'He was nervous'?",
    options: [
      { id: "a", text: "He was very nervous about the test." },
      { id: "b", text: "He felt nervous." },
      { id: "c", text: "His hands trembled as he gripped the pencil, and his eyes darted to the clock every few seconds." },
      { id: "d", text: "He was so nervous he could barely think." },
    ],
    correctOptionId: "c",
    explanation: "'Show, don't tell' uses physical actions and sensory details to convey emotions rather than stating them directly. Trembling hands and darting eyes show nervousness.",
    difficulty: 3, topic: "Writing", subtopic: "Descriptive Writing", yearLevel: 7, timeLimitSeconds: 75, subject: "writing",
  },
  {
    id: "w5",
    content: "Which transition word best fills the gap?\n\n\"The experiment was carefully designed. _______, the results were inconclusive.\"",
    options: [
      { id: "a", text: "Therefore" },
      { id: "b", text: "Furthermore" },
      { id: "c", text: "Nevertheless" },
      { id: "d", text: "Similarly" },
    ],
    correctOptionId: "c",
    explanation: "'Nevertheless' signals a contrast — the results were unexpected despite careful design. 'Therefore' implies consequence; 'Furthermore' adds information; 'Similarly' compares.",
    difficulty: 3, topic: "Writing", subtopic: "Transitions & Cohesion", yearLevel: 7, timeLimitSeconds: 60, subject: "writing",
  },
  {
    id: "w6",
    content: "Which sentence uses the active voice?",
    options: [
      { id: "a", text: "The cake was eaten by the children." },
      { id: "b", text: "The ball was kicked over the fence." },
      { id: "c", text: "The dog chased the cat across the yard." },
      { id: "d", text: "The song was sung beautifully." },
    ],
    correctOptionId: "c",
    explanation: "Active voice: subject performs the action (dog → chased → cat). In the others, the subject receives the action (passive voice: 'was eaten', 'was kicked', 'was sung').",
    difficulty: 2, topic: "Writing", subtopic: "Active vs Passive Voice", yearLevel: 5, timeLimitSeconds: 45, subject: "writing",
  },
  {
    id: "w7",
    content: "Which of these is the best thesis statement for an essay about school uniforms?",
    options: [
      { id: "a", text: "School uniforms are a topic many people discuss." },
      { id: "b", text: "I like school uniforms because they look nice." },
      { id: "c", text: "Mandatory school uniforms reduce bullying, save families money, and foster school pride." },
      { id: "d", text: "This essay will discuss school uniforms." },
    ],
    correctOptionId: "c",
    explanation: "A strong thesis is specific, arguable, and previews the essay's main points. Option C clearly states a position with three supporting reasons.",
    difficulty: 4, topic: "Writing", subtopic: "Thesis Statements", yearLevel: 7, timeLimitSeconds: 75, subject: "writing",
  },
  {
    id: "w8",
    content: "Read this narrative excerpt:\n\n\"The door opened. A man walked in. He sat down. He looked at me.\"\n\nWhat is the main problem with this writing?",
    options: [
      { id: "a", text: "It has spelling errors" },
      { id: "b", text: "It uses too many adjectives" },
      { id: "c", text: "All sentences have the same short, simple structure" },
      { id: "d", text: "It is written in the wrong tense" },
    ],
    correctOptionId: "c",
    explanation: "The writing lacks sentence variety — every sentence is short, simple, and follows the same subject-verb pattern. Varying sentence length and structure makes writing more engaging.",
    difficulty: 2, topic: "Writing", subtopic: "Sentence Variety", yearLevel: 5, timeLimitSeconds: 60, subject: "writing",
  },
  {
    id: "w9",
    content: "Which is the best concluding sentence for a persuasive paragraph about reducing screen time?",
    options: [
      { id: "a", text: "In conclusion, screens are bad." },
      { id: "b", text: "That's why I think we should use screens less." },
      { id: "c", text: "Clearly, limiting screen time can improve sleep, boost concentration, and strengthen family bonds — a small change with enormous benefits." },
      { id: "d", text: "So yeah, less screens would be good." },
    ],
    correctOptionId: "c",
    explanation: "A strong conclusion restates key arguments, uses confident language ('Clearly'), and ends with impact. The others are too informal, vague, or weak.",
    difficulty: 3, topic: "Writing", subtopic: "Conclusions", yearLevel: 7, timeLimitSeconds: 60, subject: "writing",
  },
  {
    id: "w10",
    content: "Which sentence contains a simile?",
    options: [
      { id: "a", text: "The stars danced across the sky." },
      { id: "b", text: "Her smile was like sunshine after rain." },
      { id: "c", text: "Time is money." },
      { id: "d", text: "The thunder roared angrily." },
    ],
    correctOptionId: "b",
    explanation: "A simile compares two things using 'like' or 'as'. 'Her smile was like sunshine' is a simile. A = personification, C = metaphor, D = personification.",
    difficulty: 1, topic: "Writing", subtopic: "Figurative Language", yearLevel: 5, timeLimitSeconds: 45, subject: "writing",
  },
];

// ── REASONING ──────────────────────────────────────────
const reasoningQuestions: Question[] = [
  {
    id: "re1",
    content: "Which word best completes this analogy?\n\nHot is to cold as fast is to ___",
    options: [
      { id: "a", text: "quick" },
      { id: "b", text: "speedy" },
      { id: "c", text: "slow" },
      { id: "d", text: "running" },
    ],
    correctOptionId: "c",
    explanation: "'Hot' and 'cold' are antonyms (opposites). The antonym of 'fast' is 'slow'.",
    difficulty: 1, topic: "Verbal Reasoning", subtopic: "Analogies", yearLevel: 5, timeLimitSeconds: 45, subject: "reasoning",
  },
  {
    id: "re2",
    content: "If all Bloops are Razzies, and all Razzies are Lazzies, which statement must be true?",
    options: [
      { id: "a", text: "All Lazzies are Bloops" },
      { id: "b", text: "All Bloops are Lazzies" },
      { id: "c", text: "Some Lazzies are not Razzies" },
      { id: "d", text: "All Razzies are Bloops" },
    ],
    correctOptionId: "b",
    explanation: "Bloops → Razzies → Lazzies. By transitivity, all Bloops are Lazzies. The reverse is not necessarily true.",
    difficulty: 3, topic: "Verbal Reasoning", subtopic: "Syllogisms", yearLevel: 7, timeLimitSeconds: 60, subject: "reasoning",
  },
  {
    id: "re3",
    content: "Which number comes next? 3, 5, 9, 15, 23, ___",
    options: [
      { id: "a", text: "29" },
      { id: "b", text: "31" },
      { id: "c", text: "33" },
      { id: "d", text: "35" },
    ],
    correctOptionId: "c",
    explanation: "Differences between terms: +2, +4, +6, +8 → next difference is +10. So 23 + 10 = 33.",
    difficulty: 3, topic: "Non-Verbal Reasoning", subtopic: "Number Sequences", yearLevel: 7, timeLimitSeconds: 60, subject: "reasoning",
  },
  {
    id: "re4",
    content: "Tom is taller than Sam. Sam is taller than Raj. Alex is shorter than Raj. Who is the shortest?",
    options: [
      { id: "a", text: "Tom" },
      { id: "b", text: "Sam" },
      { id: "c", text: "Raj" },
      { id: "d", text: "Alex" },
    ],
    correctOptionId: "d",
    explanation: "Order from tallest: Tom > Sam > Raj > Alex. Alex is shorter than Raj, who is shorter than Sam, who is shorter than Tom.",
    difficulty: 2, topic: "Verbal Reasoning", subtopic: "Logical Order", yearLevel: 5, timeLimitSeconds: 60, subject: "reasoning",
  },
  {
    id: "re5",
    content: "Which word does NOT belong in this group?\n\nApple, Banana, Carrot, Mango",
    options: [
      { id: "a", text: "Apple" },
      { id: "b", text: "Banana" },
      { id: "c", text: "Carrot" },
      { id: "d", text: "Mango" },
    ],
    correctOptionId: "c",
    explanation: "Apple, Banana, and Mango are fruits. Carrot is a vegetable — it doesn't belong in this group.",
    difficulty: 1, topic: "Verbal Reasoning", subtopic: "Odd One Out", yearLevel: 5, timeLimitSeconds: 30, subject: "reasoning",
  },
  {
    id: "re6",
    content: "A farmer has chickens and cows. He counts 20 heads and 56 legs. How many cows does he have?",
    options: [
      { id: "a", text: "6" },
      { id: "b", text: "8" },
      { id: "c", text: "10" },
      { id: "d", text: "12" },
    ],
    correctOptionId: "b",
    explanation: "Let c = cows, h = chickens. c + h = 20 and 4c + 2h = 56. Solving: h = 20 − c → 4c + 2(20−c) = 56 → 2c + 40 = 56 → c = 8.",
    difficulty: 4, topic: "Verbal Reasoning", subtopic: "Logic Puzzles", yearLevel: 7, timeLimitSeconds: 120, subject: "reasoning",
  },
  {
    id: "re7",
    content: "If APPLE is coded as DSSOH (each letter shifted +3), what is MANGO coded as?",
    options: [
      { id: "a", text: "PDQJR" },
      { id: "b", text: "PDQJQ" },
      { id: "c", text: "OCPIR" },
      { id: "d", text: "PDQIR" },
    ],
    correctOptionId: "a",
    explanation: "Each letter shifts forward by 3: M→P, A→D, N→Q, G→J, O→R. Answer: PDQJR.",
    difficulty: 3, topic: "Non-Verbal Reasoning", subtopic: "Codes & Ciphers", yearLevel: 7, timeLimitSeconds: 90, subject: "reasoning",
  },
  {
    id: "re8",
    content: "Five friends sit in a row. Ben is to the left of Amy. Amy is between Ben and Chloe. Dan is at the right end. Ella is to the left of Ben.\n\nWho is in the middle?",
    options: [
      { id: "a", text: "Ben" },
      { id: "b", text: "Amy" },
      { id: "c", text: "Chloe" },
      { id: "d", text: "Ella" },
    ],
    correctOptionId: "b",
    explanation: "From the clues: Ella, Ben, Amy, Chloe, Dan. Amy is in position 3 (the middle).",
    difficulty: 3, topic: "Verbal Reasoning", subtopic: "Spatial Arrangement", yearLevel: 7, timeLimitSeconds: 90, subject: "reasoning",
  },
  {
    id: "re9",
    content: "Which conclusion follows from these statements?\n\n• All teachers at this school speak English.\n• Mrs. Chen is a teacher at this school.",
    options: [
      { id: "a", text: "Mrs. Chen speaks only English" },
      { id: "b", text: "Mrs. Chen speaks English" },
      { id: "c", text: "All English speakers are teachers" },
      { id: "d", text: "Mrs. Chen is the only teacher" },
    ],
    correctOptionId: "b",
    explanation: "Since all teachers speak English, and Mrs. Chen is a teacher, she must speak English. This doesn't mean she speaks only English or that all English speakers are teachers.",
    difficulty: 2, topic: "Verbal Reasoning", subtopic: "Deductive Reasoning", yearLevel: 5, timeLimitSeconds: 60, subject: "reasoning",
  },
  {
    id: "re10",
    content: "A clock shows 3:00. What is the angle between the hour and minute hands?",
    options: [
      { id: "a", text: "60°" },
      { id: "b", text: "90°" },
      { id: "c", text: "120°" },
      { id: "d", text: "180°" },
    ],
    correctOptionId: "b",
    explanation: "A clock face is 360°. There are 12 hours, so each hour = 30°. At 3:00, the hands are 3 hours apart: 3 × 30° = 90°.",
    difficulty: 2, topic: "Non-Verbal Reasoning", subtopic: "Spatial Reasoning", yearLevel: 5, timeLimitSeconds: 45, subject: "reasoning",
  },
];

// ── CONVENTIONS ────────────────────────────────────────
const conventionsQuestions: Question[] = [
  {
    id: "c1",
    content: "Which of the following sentences uses the correct punctuation?",
    options: [
      { id: "a", text: "The dog, chased the cat around the yard." },
      { id: "b", text: "The dog chased the cat, around the yard." },
      { id: "c", text: "The dog chased the cat around the yard." },
      { id: "d", text: "The dog chased, the cat around the yard." },
    ],
    correctOptionId: "c",
    explanation: "This is a simple sentence — no commas are needed because there are no pauses, lists, or subordinate clauses.",
    difficulty: 1, topic: "Language Conventions", subtopic: "Punctuation", yearLevel: 5, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "c2",
    content: "Which sentence uses the correct form of 'their/there/they're'?",
    options: [
      { id: "a", text: "Their going to the park after school." },
      { id: "b", text: "The students left there bags in the classroom." },
      { id: "c", text: "They're planning a surprise party for Friday." },
      { id: "d", text: "There excited about the excursion." },
    ],
    correctOptionId: "c",
    explanation: "'They're' = they are. 'Their' = belonging to them. 'There' = a place. 'They're planning' = 'They are planning' ✓.",
    difficulty: 1, topic: "Language Conventions", subtopic: "Homophones", yearLevel: 5, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "c3",
    content: "Which sentence has correct subject-verb agreement?",
    options: [
      { id: "a", text: "The group of students were late to class." },
      { id: "b", text: "The group of students was late to class." },
      { id: "c", text: "The group of students are being late to class." },
      { id: "d", text: "The group of students have been late to class." },
    ],
    correctOptionId: "b",
    explanation: "'Group' is a collective noun (singular). 'The group … was' is correct. The prepositional phrase 'of students' doesn't change the subject.",
    difficulty: 3, topic: "Language Conventions", subtopic: "Subject-Verb Agreement", yearLevel: 7, timeLimitSeconds: 60, subject: "conventions",
  },
  {
    id: "c4",
    content: "Which word correctly completes the sentence?\n\n\"The weather today is much _______ than yesterday.\"",
    options: [
      { id: "a", text: "worst" },
      { id: "b", text: "worse" },
      { id: "c", text: "bad" },
      { id: "d", text: "more worst" },
    ],
    correctOptionId: "b",
    explanation: "'Worse' is the comparative form of 'bad' (used when comparing two things). 'Worst' is superlative (three or more). 'More worst' is incorrect — never double-compare.",
    difficulty: 2, topic: "Language Conventions", subtopic: "Comparative & Superlative", yearLevel: 5, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "c5",
    content: "Where should the apostrophe go?\n\n\"The childrens toys were scattered everywhere.\"",
    options: [
      { id: "a", text: "children's" },
      { id: "b", text: "childrens'" },
      { id: "c", text: "childrens's" },
      { id: "d", text: "No apostrophe needed" },
    ],
    correctOptionId: "a",
    explanation: "'Children' is already plural (irregular). Add 's to show possession: children's. You only put the apostrophe after the s for regular plurals (e.g., dogs').",
    difficulty: 2, topic: "Language Conventions", subtopic: "Apostrophes", yearLevel: 5, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "c6",
    content: "Which sentence uses a semicolon correctly?",
    options: [
      { id: "a", text: "I love reading; and writing stories." },
      { id: "b", text: "She studied hard; she passed the exam." },
      { id: "c", text: "The dog barked; loudly at the mailman." },
      { id: "d", text: "We went to the beach; it." },
    ],
    correctOptionId: "b",
    explanation: "A semicolon joins two independent clauses (complete sentences) that are closely related. 'She studied hard' and 'she passed the exam' are both complete sentences.",
    difficulty: 4, topic: "Language Conventions", subtopic: "Semicolons", yearLevel: 7, timeLimitSeconds: 60, subject: "conventions",
  },
  {
    id: "c7",
    content: "Which sentence is written in the past tense?",
    options: [
      { id: "a", text: "She runs to school every morning." },
      { id: "b", text: "She will run to school tomorrow." },
      { id: "c", text: "She ran to school yesterday." },
      { id: "d", text: "She is running to school right now." },
    ],
    correctOptionId: "c",
    explanation: "'Ran' is the past tense of 'run'. A = present, B = future, D = present continuous.",
    difficulty: 1, topic: "Language Conventions", subtopic: "Tense", yearLevel: 5, timeLimitSeconds: 30, subject: "conventions",
  },
  {
    id: "c8",
    content: "Which sentence contains a correctly used colon?",
    options: [
      { id: "a", text: "I need: eggs, milk, and bread." },
      { id: "b", text: "She had one goal: to win the championship." },
      { id: "c", text: "The dog: barked at the stranger." },
      { id: "d", text: "He ran: quickly to the store." },
    ],
    correctOptionId: "b",
    explanation: "A colon introduces an explanation, list, or elaboration after a complete sentence. 'She had one goal' is a complete thought, and the colon introduces what that goal is.",
    difficulty: 4, topic: "Language Conventions", subtopic: "Colons", yearLevel: 7, timeLimitSeconds: 60, subject: "conventions",
  },
  {
    id: "c9",
    content: "Which word is a conjunction in this sentence?\n\n\"I wanted to go to the park, but it started raining.\"",
    options: [
      { id: "a", text: "wanted" },
      { id: "b", text: "park" },
      { id: "c", text: "but" },
      { id: "d", text: "raining" },
    ],
    correctOptionId: "c",
    explanation: "'But' is a coordinating conjunction — it joins two independent clauses and shows contrast. The seven coordinating conjunctions are: for, and, nor, but, or, yet, so (FANBOYS).",
    difficulty: 1, topic: "Language Conventions", subtopic: "Parts of Speech", yearLevel: 5, timeLimitSeconds: 30, subject: "conventions",
  },
  {
    id: "c10",
    content: "Which sentence correctly uses a relative pronoun?",
    options: [
      { id: "a", text: "The boy which won the race is my friend." },
      { id: "b", text: "The boy who won the race is my friend." },
      { id: "c", text: "The boy whom won the race is my friend." },
      { id: "d", text: "The boy whose won the race is my friend." },
    ],
    correctOptionId: "b",
    explanation: "'Who' is used for people as a subject pronoun. 'Which' is for things/animals. 'Whom' is for objects. 'Whose' shows possession. The boy is the subject → 'who'.",
    difficulty: 3, topic: "Language Conventions", subtopic: "Relative Pronouns", yearLevel: 7, timeLimitSeconds: 60, subject: "conventions",
  },
];

// ── NAPLAN 2012–2016 INSPIRED QUESTION PACK ────────────
// Style/content modelled on publicly released NAPLAN test papers (Years 3, 5, 7)
// across Numeracy, Reading and Language Conventions.
const naplanPack: Question[] = [
  // ---- Numeracy (Year 3 / 5 / 7) ----
  {
    id: "n_m1",
    content: "Look at this number: 4 086\n\nWhat is the value of the digit 8?",
    options: [
      { id: "a", text: "8" },
      { id: "b", text: "80" },
      { id: "c", text: "800" },
      { id: "d", text: "8 000" },
    ],
    correctOptionId: "b",
    explanation: "In 4 086, the 8 is in the tens place, so its value is 80.",
    difficulty: 1, topic: "Number & Algebra", subtopic: "Place Value", yearLevel: 3, timeLimitSeconds: 45, subject: "maths",
  },
  {
    id: "n_m2",
    content: "A class has 28 students. They are arranged in 4 equal rows. How many students are in each row?",
    options: [
      { id: "a", text: "6" },
      { id: "b", text: "7" },
      { id: "c", text: "8" },
      { id: "d", text: "9" },
    ],
    correctOptionId: "b",
    explanation: "28 ÷ 4 = 7 students per row.",
    difficulty: 1, topic: "Number & Algebra", subtopic: "Division", yearLevel: 3, timeLimitSeconds: 45, subject: "maths",
  },
  {
    id: "n_m3",
    content: "Which of these shapes has exactly 5 sides?",
    options: [
      { id: "a", text: "Hexagon" },
      { id: "b", text: "Pentagon" },
      { id: "c", text: "Octagon" },
      { id: "d", text: "Quadrilateral" },
    ],
    correctOptionId: "b",
    explanation: "A pentagon has 5 sides. Hexagon=6, octagon=8, quadrilateral=4.",
    difficulty: 1, topic: "Measurement & Geometry", subtopic: "2D Shapes", yearLevel: 3, timeLimitSeconds: 30, subject: "maths",
  },
  {
    id: "n_m4",
    content: "Sam has $5.00. He buys an apple for $1.20 and a juice for $2.50. How much money does he have left?",
    options: [
      { id: "a", text: "$1.30" },
      { id: "b", text: "$1.50" },
      { id: "c", text: "$2.30" },
      { id: "d", text: "$3.70" },
    ],
    correctOptionId: "a",
    explanation: "Total spent: $1.20 + $2.50 = $3.70. Change: $5.00 − $3.70 = $1.30.",
    difficulty: 2, topic: "Number & Algebra", subtopic: "Money", yearLevel: 3, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "n_m5",
    content: "Which fraction is equivalent to 1/2?",
    options: [
      { id: "a", text: "2/3" },
      { id: "b", text: "3/5" },
      { id: "c", text: "4/8" },
      { id: "d", text: "5/12" },
    ],
    correctOptionId: "c",
    explanation: "4/8 simplifies to 1/2 (divide top and bottom by 4).",
    difficulty: 2, topic: "Number & Algebra", subtopic: "Fractions", yearLevel: 5, timeLimitSeconds: 45, subject: "maths",
  },
  {
    id: "n_m6",
    content: "A rectangle has length 9 cm and width 4 cm. What is its area?",
    options: [
      { id: "a", text: "13 cm²" },
      { id: "b", text: "26 cm²" },
      { id: "c", text: "36 cm²" },
      { id: "d", text: "40 cm²" },
    ],
    correctOptionId: "c",
    explanation: "Area of a rectangle = length × width = 9 × 4 = 36 cm².",
    difficulty: 2, topic: "Measurement & Geometry", subtopic: "Area", yearLevel: 5, timeLimitSeconds: 45, subject: "maths",
  },
  {
    id: "n_m7",
    content: "Round 3 island lengths: 2 487 m, 2 503 m, 2 449 m. Which is closest to 2 500 m?",
    options: [
      { id: "a", text: "2 487 m" },
      { id: "b", text: "2 503 m" },
      { id: "c", text: "2 449 m" },
      { id: "d", text: "All the same" },
    ],
    correctOptionId: "b",
    explanation: "Distances from 2 500: 13, 3, 51. The smallest is 3, so 2 503 m is closest.",
    difficulty: 3, topic: "Number & Algebra", subtopic: "Rounding", yearLevel: 5, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "n_m8",
    content: "A bus leaves at 9:35 am and arrives at 11:10 am. How long was the trip?",
    options: [
      { id: "a", text: "1 hour 25 minutes" },
      { id: "b", text: "1 hour 35 minutes" },
      { id: "c", text: "1 hour 45 minutes" },
      { id: "d", text: "2 hours 25 minutes" },
    ],
    correctOptionId: "b",
    explanation: "From 9:35 to 10:35 is 1 hour. From 10:35 to 11:10 is 35 minutes. Total = 1 hour 35 minutes.",
    difficulty: 3, topic: "Measurement & Geometry", subtopic: "Time", yearLevel: 5, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "n_m9",
    content: "The temperature was −3°C in the morning. By the afternoon it had risen by 11°C. What was the afternoon temperature?",
    options: [
      { id: "a", text: "8°C" },
      { id: "b", text: "11°C" },
      { id: "c", text: "14°C" },
      { id: "d", text: "−14°C" },
    ],
    correctOptionId: "a",
    explanation: "−3 + 11 = 8°C.",
    difficulty: 3, topic: "Number & Algebra", subtopic: "Integers", yearLevel: 7, timeLimitSeconds: 45, subject: "maths",
  },
  {
    id: "n_m10",
    content: "What is 25% of 160?",
    options: [
      { id: "a", text: "25" },
      { id: "b", text: "32" },
      { id: "c", text: "40" },
      { id: "d", text: "64" },
    ],
    correctOptionId: "c",
    explanation: "25% = 1/4. 1/4 of 160 = 40.",
    difficulty: 3, topic: "Number & Algebra", subtopic: "Percentages", yearLevel: 7, timeLimitSeconds: 45, subject: "maths",
  },
  {
    id: "n_m11",
    content: "A bag contains 3 red, 5 blue and 2 green marbles. One marble is taken out at random. What is the probability it is blue?",
    options: [
      { id: "a", text: "1/5" },
      { id: "b", text: "1/3" },
      { id: "c", text: "1/2" },
      { id: "d", text: "5/10" },
    ],
    correctOptionId: "c",
    explanation: "Total marbles = 10. Blue = 5. Probability = 5/10 = 1/2. (Note: 5/10 and 1/2 are the same value, but the simplified form 1/2 is the standard answer.)",
    difficulty: 3, topic: "Statistics & Probability", subtopic: "Probability", yearLevel: 7, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "n_m12",
    content: "If 3n + 4 = 19, what is the value of n?",
    options: [
      { id: "a", text: "3" },
      { id: "b", text: "5" },
      { id: "c", text: "7" },
      { id: "d", text: "15" },
    ],
    correctOptionId: "b",
    explanation: "3n + 4 = 19 → 3n = 15 → n = 5.",
    difficulty: 3, topic: "Number & Algebra", subtopic: "Linear Equations", yearLevel: 7, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "n_m13",
    content: "A shop offers a 20% discount on a $45 shirt. What is the sale price?",
    options: [
      { id: "a", text: "$9" },
      { id: "b", text: "$25" },
      { id: "c", text: "$36" },
      { id: "d", text: "$40" },
    ],
    correctOptionId: "c",
    explanation: "20% of $45 = $9. Sale price = $45 − $9 = $36.",
    difficulty: 3, topic: "Number & Algebra", subtopic: "Percentages", yearLevel: 7, timeLimitSeconds: 60, subject: "maths",
  },
  {
    id: "n_m14",
    content: "The mean of five numbers is 12. Four of the numbers are 8, 10, 14 and 16. What is the fifth number?",
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "12" },
      { id: "c", text: "14" },
      { id: "d", text: "16" },
    ],
    correctOptionId: "b",
    explanation: "Total of 5 numbers = 5 × 12 = 60. Sum of four given = 8+10+14+16 = 48. Fifth = 60 − 48 = 12.",
    difficulty: 4, topic: "Statistics & Probability", subtopic: "Mean", yearLevel: 7, timeLimitSeconds: 75, subject: "maths",
  },
  {
    id: "n_m15",
    content: "A right-angled triangle has legs of 6 cm and 8 cm. How long is the hypotenuse?",
    options: [
      { id: "a", text: "10 cm" },
      { id: "b", text: "12 cm" },
      { id: "c", text: "14 cm" },
      { id: "d", text: "48 cm" },
    ],
    correctOptionId: "a",
    explanation: "By Pythagoras: c² = 6² + 8² = 36 + 64 = 100, so c = 10 cm.",
    difficulty: 4, topic: "Measurement & Geometry", subtopic: "Pythagoras", yearLevel: 7, timeLimitSeconds: 75, subject: "maths",
  },

  // ---- Reading (passages typical of NAPLAN) ----
  {
    id: "n_r1",
    content: "Read this passage:\n\n\"The wombat is a stocky Australian marsupial with short legs and a small tail. Wombats dig long burrows underground using their strong claws. They are mostly active at night, when the temperature is cooler.\"\n\nWhy are wombats mostly active at night?",
    options: [
      { id: "a", text: "Because they have short legs" },
      { id: "b", text: "Because the temperature is cooler" },
      { id: "c", text: "Because they live in burrows" },
      { id: "d", text: "Because they are marsupials" },
    ],
    correctOptionId: "b",
    explanation: "The passage states directly: 'They are mostly active at night, when the temperature is cooler.'",
    difficulty: 1, topic: "Reading Comprehension", subtopic: "Locating Information", yearLevel: 3, timeLimitSeconds: 60, subject: "reading",
  },
  {
    id: "n_r2",
    content: "Read this passage:\n\n\"Maya pulled her jacket tighter and stamped her feet. The wind cut through the bus shelter and her breath made little clouds in the air.\"\n\nWhat is the weather most likely like?",
    options: [
      { id: "a", text: "Hot and sunny" },
      { id: "b", text: "Warm and humid" },
      { id: "c", text: "Cold and windy" },
      { id: "d", text: "Rainy and mild" },
    ],
    correctOptionId: "c",
    explanation: "Clues like 'pulled her jacket tighter', 'wind cut through' and 'breath made little clouds' all signal cold, windy weather.",
    difficulty: 2, topic: "Reading Comprehension", subtopic: "Inference", yearLevel: 5, timeLimitSeconds: 75, subject: "reading",
  },
  {
    id: "n_r3",
    content: "Read this passage:\n\n\"Coral reefs are sometimes called the rainforests of the sea because they support an enormous variety of life. However, rising ocean temperatures are causing many corals to bleach and die.\"\n\nWhy are coral reefs compared to rainforests?",
    options: [
      { id: "a", text: "They are both green" },
      { id: "b", text: "They both grow in warm climates" },
      { id: "c", text: "They both support a wide variety of life" },
      { id: "d", text: "They are both endangered" },
    ],
    correctOptionId: "c",
    explanation: "The passage explains the comparison directly: reefs 'support an enormous variety of life', like rainforests.",
    difficulty: 2, topic: "Reading Comprehension", subtopic: "Author's Purpose", yearLevel: 5, timeLimitSeconds: 60, subject: "reading",
  },
  {
    id: "n_r4",
    content: "Read this passage:\n\n\"The old lighthouse keeper squinted into the storm. For forty years he had watched these waters, and he had never seen a wave quite like this one.\"\n\nWhat does the word 'squinted' suggest about the keeper?\n",
    options: [
      { id: "a", text: "He was sleeping" },
      { id: "b", text: "He was straining to see clearly" },
      { id: "c", text: "He was angry" },
      { id: "d", text: "He was afraid" },
    ],
    correctOptionId: "b",
    explanation: "To 'squint' means to partly close your eyes to see better — usually because of strong light, distance or, here, a storm.",
    difficulty: 3, topic: "Reading Comprehension", subtopic: "Vocabulary in Context", yearLevel: 5, timeLimitSeconds: 60, subject: "reading",
  },
  {
    id: "n_r5",
    content: "Read this passage:\n\n\"Although electric cars produce no exhaust fumes, the electricity used to charge them is often generated by burning coal. So the environmental benefit depends a great deal on where you live.\"\n\nWhat is the writer's main point?",
    options: [
      { id: "a", text: "Electric cars are always better for the environment." },
      { id: "b", text: "Coal power is bad for the environment." },
      { id: "c", text: "The benefit of electric cars depends on how the electricity is made." },
      { id: "d", text: "Electric cars are too expensive for most people." },
    ],
    correctOptionId: "c",
    explanation: "The writer balances a positive (no exhaust fumes) with a qualifier (charging power often comes from coal), concluding the benefit varies by location.",
    difficulty: 4, topic: "Reading Comprehension", subtopic: "Main Idea", yearLevel: 7, timeLimitSeconds: 90, subject: "reading",
  },
  {
    id: "n_r6",
    content: "Read this passage:\n\n\"The committee's decision was met with a chorus of disapproval from the local community.\"\n\nWhat does 'a chorus of disapproval' suggest?",
    options: [
      { id: "a", text: "A few people sang in protest" },
      { id: "b", text: "Many people expressed disagreement together" },
      { id: "c", text: "The community was confused" },
      { id: "d", text: "The committee changed its mind" },
    ],
    correctOptionId: "b",
    explanation: "'Chorus' here is figurative — it means many voices speaking together. So many people were expressing disapproval at once.",
    difficulty: 4, topic: "Reading Comprehension", subtopic: "Figurative Language", yearLevel: 7, timeLimitSeconds: 60, subject: "reading",
  },

  // ---- Language Conventions (spelling, grammar, punctuation) ----
  {
    id: "n_c1",
    content: "Which word is spelt correctly?",
    options: [
      { id: "a", text: "freind" },
      { id: "b", text: "friend" },
      { id: "c", text: "frend" },
      { id: "d", text: "freand" },
    ],
    correctOptionId: "b",
    explanation: "The correct spelling is 'friend'. Remember the rule: 'i before e except after c'.",
    difficulty: 1, topic: "Language Conventions", subtopic: "Spelling", yearLevel: 3, timeLimitSeconds: 30, subject: "conventions",
  },
  {
    id: "n_c2",
    content: "Which sentence uses capital letters correctly?",
    options: [
      { id: "a", text: "we visited Sydney in july." },
      { id: "b", text: "We visited sydney in July." },
      { id: "c", text: "We visited Sydney in July." },
      { id: "d", text: "We Visited Sydney In July." },
    ],
    correctOptionId: "c",
    explanation: "Capitalise the first word of a sentence, place names (Sydney) and months (July). Common nouns are not capitalised.",
    difficulty: 1, topic: "Language Conventions", subtopic: "Capitalisation", yearLevel: 3, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "n_c3",
    content: "Choose the word that completes the sentence correctly:\n\n\"There are ____ apples in the bowl than oranges.\"",
    options: [
      { id: "a", text: "more" },
      { id: "b", text: "most" },
      { id: "c", text: "much" },
      { id: "d", text: "many" },
    ],
    correctOptionId: "a",
    explanation: "'More' is used when comparing two things. 'Most' is for three or more. 'Much' is for uncountable nouns.",
    difficulty: 2, topic: "Language Conventions", subtopic: "Comparatives", yearLevel: 5, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "n_c4",
    content: "Which sentence uses an apostrophe correctly?",
    options: [
      { id: "a", text: "The dogs' tail wagged happily." },
      { id: "b", text: "The dog's tail wagged happily." },
      { id: "c", text: "The dogs tail's wagged happily." },
      { id: "d", text: "The dog's tail's wagged happily." },
    ],
    correctOptionId: "b",
    explanation: "One dog owns the tail, so the apostrophe goes before the s: 'dog's tail'. 'Dogs'' would mean more than one dog.",
    difficulty: 2, topic: "Language Conventions", subtopic: "Apostrophes", yearLevel: 5, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "n_c5",
    content: "Which word is spelt correctly?",
    options: [
      { id: "a", text: "neccessary" },
      { id: "b", text: "necesary" },
      { id: "c", text: "necessary" },
      { id: "d", text: "neccesary" },
    ],
    correctOptionId: "c",
    explanation: "The correct spelling is 'necessary' — one c, double s.",
    difficulty: 3, topic: "Language Conventions", subtopic: "Spelling", yearLevel: 5, timeLimitSeconds: 30, subject: "conventions",
  },
  {
    id: "n_c6",
    content: "Which sentence is punctuated correctly?",
    options: [
      { id: "a", text: "After the rain stopped, we went outside to play." },
      { id: "b", text: "After the rain stopped we went, outside to play." },
      { id: "c", text: "After, the rain stopped we went outside to play." },
      { id: "d", text: "After the rain, stopped we went outside to play." },
    ],
    correctOptionId: "a",
    explanation: "When a sentence starts with a dependent clause ('After the rain stopped'), use a comma before the main clause.",
    difficulty: 3, topic: "Language Conventions", subtopic: "Commas", yearLevel: 7, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "n_c7",
    content: "Choose the correct word:\n\n\"The team played well, but ____ lost the final.\"",
    options: [
      { id: "a", text: "they're" },
      { id: "b", text: "their" },
      { id: "c", text: "there" },
      { id: "d", text: "they" },
    ],
    correctOptionId: "d",
    explanation: "We need a subject pronoun for the verb 'lost'. 'They' fits. 'They're' = they are; 'their' = possessive; 'there' = a place.",
    difficulty: 3, topic: "Language Conventions", subtopic: "Pronouns", yearLevel: 7, timeLimitSeconds: 45, subject: "conventions",
  },
  {
    id: "n_c8",
    content: "Which sentence uses the verb tense correctly?",
    options: [
      { id: "a", text: "Yesterday I go to the shops and buy bread." },
      { id: "b", text: "Yesterday I went to the shops and bought bread." },
      { id: "c", text: "Yesterday I went to the shops and buy bread." },
      { id: "d", text: "Yesterday I goes to the shops and bought bread." },
    ],
    correctOptionId: "b",
    explanation: "'Yesterday' signals past tense, so both verbs must be in the past: 'went' and 'bought'.",
    difficulty: 2, topic: "Language Conventions", subtopic: "Verb Tense", yearLevel: 5, timeLimitSeconds: 45, subject: "conventions",
  },

  // ---- Reasoning (light selective-style, in NAPLAN spirit) ----
  {
    id: "n_rs1",
    content: "Anna is taller than Ben. Ben is taller than Carlos. Who is the shortest?",
    options: [
      { id: "a", text: "Anna" },
      { id: "b", text: "Ben" },
      { id: "c", text: "Carlos" },
      { id: "d", text: "Cannot tell" },
    ],
    correctOptionId: "c",
    explanation: "Order from tallest to shortest: Anna > Ben > Carlos. So Carlos is the shortest.",
    difficulty: 2, topic: "Reasoning", subtopic: "Logical Ordering", yearLevel: 5, timeLimitSeconds: 45, subject: "reasoning",
  },
  {
    id: "n_rs2",
    content: "Look at the pattern: 1, 4, 9, 16, 25, ...\n\nWhat is the next number?",
    options: [
      { id: "a", text: "30" },
      { id: "b", text: "32" },
      { id: "c", text: "36" },
      { id: "d", text: "49" },
    ],
    correctOptionId: "c",
    explanation: "These are square numbers: 1², 2², 3², 4², 5². The next is 6² = 36.",
    difficulty: 3, topic: "Reasoning", subtopic: "Number Patterns", yearLevel: 5, timeLimitSeconds: 45, subject: "reasoning",
  },
  {
    id: "n_rs3",
    content: "All birds have feathers. A penguin is a bird. Which statement must be true?",
    options: [
      { id: "a", text: "All animals with feathers are penguins." },
      { id: "b", text: "Penguins have feathers." },
      { id: "c", text: "All birds can fly." },
      { id: "d", text: "Only birds have feathers." },
    ],
    correctOptionId: "b",
    explanation: "If all birds have feathers and a penguin is a bird, then penguins must have feathers. The other statements add information not given.",
    difficulty: 3, topic: "Reasoning", subtopic: "Deductive Reasoning", yearLevel: 7, timeLimitSeconds: 60, subject: "reasoning",
  },
  {
    id: "n_rs4",
    content: "A clock shows 3:00. What is the angle between the hour and minute hands?",
    options: [
      { id: "a", text: "30°" },
      { id: "b", text: "60°" },
      { id: "c", text: "90°" },
      { id: "d", text: "180°" },
    ],
    correctOptionId: "c",
    explanation: "There are 12 hour marks around 360°, so each hour represents 30°. At 3:00 the hands are 3 hours apart = 3 × 30° = 90°.",
    difficulty: 3, topic: "Reasoning", subtopic: "Spatial Reasoning", yearLevel: 7, timeLimitSeconds: 60, subject: "reasoning",
  },

  // ---- Writing prompts (NAPLAN narrative/persuasive style) ----
  {
    id: "n_w1",
    content: "Read this writing prompt and choose the best opening sentence:\n\nPROMPT: Write a narrative about a day when something unexpected happened at school.",
    options: [
      { id: "a", text: "I will write a story about school today." },
      { id: "b", text: "School is a place where you learn things." },
      { id: "c", text: "The fire alarm started screaming just as Ms Patel handed back our maths tests." },
      { id: "d", text: "There are many unexpected things that can happen." },
    ],
    correctOptionId: "c",
    explanation: "Strong narrative openings drop the reader straight into a specific moment with action and detail. Option C does this; the others tell rather than show.",
    difficulty: 3, topic: "Writing", subtopic: "Narrative Openings", yearLevel: 5, timeLimitSeconds: 60, subject: "writing",
  },
  {
    id: "n_w2",
    content: "PERSUASIVE WRITING — which sentence makes the strongest argument?",
    options: [
      { id: "a", text: "I think recess should be longer because it would be good." },
      { id: "b", text: "Recess should be longer because students who get more time to move and play return to class more focused and learn better." },
      { id: "c", text: "Recess should be longer. That is my opinion." },
      { id: "d", text: "Some people say recess should be longer." },
    ],
    correctOptionId: "b",
    explanation: "Strong persuasive writing states a clear position AND gives a reason with evidence. Option B does both; the others are vague.",
    difficulty: 3, topic: "Writing", subtopic: "Persuasive Arguments", yearLevel: 5, timeLimitSeconds: 60, subject: "writing",
  },
  {
    id: "n_w3",
    content: "Which sentence shows the best use of descriptive language?",
    options: [
      { id: "a", text: "The dog was big and brown." },
      { id: "b", text: "The huge brown dog bounded across the wet grass, ears flapping." },
      { id: "c", text: "There was a dog. It was brown." },
      { id: "d", text: "I saw a dog that was brown and big." },
    ],
    correctOptionId: "b",
    explanation: "Option B uses a strong verb ('bounded'), specific adjectives ('huge', 'wet') and a vivid detail ('ears flapping') to paint a picture.",
    difficulty: 2, topic: "Writing", subtopic: "Descriptive Language", yearLevel: 5, timeLimitSeconds: 45, subject: "writing",
  },
  {
    id: "n_w4",
    content: "Which sentence is the best concluding sentence for a persuasive piece arguing that schools should plant more trees?",
    options: [
      { id: "a", text: "So that's my opinion about trees." },
      { id: "b", text: "Trees are nice and green." },
      { id: "c", text: "By planting more trees, schools can cool playgrounds, support wildlife and teach students to care for the environment — a small change with a lasting impact." },
      { id: "d", text: "I hope you liked reading my essay." },
    ],
    correctOptionId: "c",
    explanation: "A strong persuasive conclusion restates the position and summarises the key reasons in a memorable way, as Option C does.",
    difficulty: 4, topic: "Writing", subtopic: "Persuasive Conclusions", yearLevel: 7, timeLimitSeconds: 75, subject: "writing",
  },
];

// ── COMBINED EXPORT ────────────────────────────────────
import { naplanGeneratedPack } from "./naplanGeneratedPack";

export const sampleQuestions: Question[] = [
  ...mathsQuestions,
  ...readingQuestions,
  ...writingQuestions,
  ...reasoningQuestions,
  ...conventionsQuestions,
  ...naplanPack,
  ...naplanGeneratedPack,
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
  // Group by closeness to target difficulty, then pick randomly within the best group
  const minDist = Math.min(...available.map((q) => Math.abs(q.difficulty - targetDifficulty)));
  const bestMatch = available.filter(
    (q) => Math.abs(q.difficulty - targetDifficulty) <= minDist + 1
  );
  return bestMatch[Math.floor(Math.random() * bestMatch.length)];
}
