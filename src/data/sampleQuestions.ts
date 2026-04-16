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

// ── COMBINED EXPORT ────────────────────────────────────
export const sampleQuestions: Question[] = [
  ...mathsQuestions,
  ...readingQuestions,
  ...writingQuestions,
  ...reasoningQuestions,
  ...conventionsQuestions,
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
  const sorted = [...available].sort(
    (a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
  );
  return sorted[0];
}
