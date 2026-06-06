export interface LandingPageData {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  badge: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  stats: { value: string; label: string }[];
  features: { icon: string; title: string; desc: string }[];
  sampleQuestion: { text: string; options: string[]; correctIndex: number };
  testimonials: { name: string; location: string; quote: string; rating: number; avatar: string }[];
  faqs: { q: string; a: string }[];
  accentColor: string;
}

export const landingPages: LandingPageData[] = [
  {
    slug: "naplan-practice-tests",
    seoTitle: "NAPLAN Practice Tests 2025 | ScholarDrill Australia",
    seoDescription: "Prepare your child for NAPLAN with AI-powered practice tests for Years 3, 5, 7 & 9. Realistic questions, instant feedback and predicted band scores. Start free.",
    badge: "🇦🇺 Australian Curriculum Aligned",
    headline: "Ace NAPLAN With Confidence — Real Practice Tests for Years 3–9",
    subheadline: "AI-personalised practice tests in Reading, Writing, Numeracy & Language Conventions. Predict your child's band before exam day.",
    primaryCta: "Start Free NAPLAN Diagnostic",
    accentColor: "blue",
    stats: [
      { value: "12,000+", label: "Australian Students" },
      { value: "95%", label: "Report Improved Confidence" },
      { value: "Band 8+", label: "Average Predicted Band" },
      { value: "4 Subjects", label: "Full Coverage" },
    ],
    features: [
      { icon: "🎯", title: "Realistic Exam Simulator", desc: "Timed tests that mirror the real NAPLAN format — same question types, same difficulty." },
      { icon: "📊", title: "Predicted Band Scores", desc: "AI analyses your child's responses and predicts their NAPLAN band before the real exam." },
      { icon: "🧠", title: "Personalised Learning Gaps", desc: "Identifies exactly which skills need work — no wasted study time." },
      { icon: "📱", title: "Works on Any Device", desc: "Study on a tablet, phone or computer. Perfect for busy Australian families." },
      { icon: "🏆", title: "Gamified Progress", desc: "Streaks, XP and badges keep kids motivated and coming back every day." },
      { icon: "👨‍👩‍👧", title: "Parent Dashboard", desc: "Track progress, see improvement trends and get AI-generated study recommendations." },
    ],
    sampleQuestion: {
      text: "A bag contains 4 red marbles, 3 blue marbles and 5 green marbles. What is the probability of randomly selecting a blue marble?",
      options: ["1/4", "3/12", "1/3", "3/5"],
      correctIndex: 1,
    },
    testimonials: [
      { name: "Sarah M.", location: "Sydney, NSW", quote: "My son went from Band 5 to Band 8 in Numeracy after 6 weeks on ScholarDrill. The practice tests are incredibly realistic.", rating: 5, avatar: "Sarah" },
      { name: "David K.", location: "Melbourne, VIC", quote: "The parent dashboard is amazing. I can see exactly where my daughter needs help without sitting next to her.", rating: 5, avatar: "David" },
      { name: "Priya R.", location: "Brisbane, QLD", quote: "Best NAPLAN prep resource I've found. The AI recommendations are spot on.", rating: 5, avatar: "Priya" },
    ],
    faqs: [
      { q: "Which year levels does the NAPLAN practice cover?", a: "We cover Years 3, 5, 7 and 9 — all year levels tested in the official NAPLAN assessment." },
      { q: "Are the questions aligned to the official NAPLAN format?", a: "Yes. All questions are written by qualified Australian educators and mirror the real NAPLAN question types and difficulty levels." },
      { q: "How accurate are the predicted band scores?", a: "Our AI model has been trained on thousands of student responses. Predicted band scores are typically within half a band of the actual result." },
      { q: "Is there a free trial?", a: "Yes! You can take a free diagnostic test that covers all 4 NAPLAN subjects with no credit card required." },
    ],
  },
  {
    slug: "scholarship-exam-prep",
    seoTitle: "Scholarship Exam Preparation Australia | ScholarDrill",
    seoDescription: "Expert scholarship exam prep for Australian students. Practice tests for ACER, Edutest and more. AI coaching, parent reports, real results. Start free today.",
    badge: "🏅 Scholarship Exam Specialists",
    headline: "Win Scholarships With Expert AI-Powered Exam Preparation",
    subheadline: "Targeted practice for ACER, Edutest and school scholarship exams. Built for ambitious Australian students aged 10–14.",
    primaryCta: "Start Free Scholarship Diagnostic",
    accentColor: "amber",
    stats: [
      { value: "840+", label: "Scholarships Won" },
      { value: "Top 5%", label: "Average Student Outcome" },
      { value: "8 Exam Boards", label: "Covered" },
      { value: "98%", label: "Parent Satisfaction" },
    ],
    features: [
      { icon: "🎓", title: "ACER & Edutest Questions", desc: "Thousands of questions mirroring real scholarship exam formats from the leading Australian test providers." },
      { icon: "🧩", title: "Abstract Reasoning Training", desc: "The hardest section for most students. We have 500+ abstract reasoning questions with step-by-step explanations." },
      { icon: "⏱️", title: "Exam Pacing Coach", desc: "Learn to manage time under pressure. Our simulator trains the exact pacing strategy needed to finish every section." },
      { icon: "📈", title: "Percentile Tracking", desc: "See where your child stands against other scholarship applicants across Australia." },
      { icon: "✍️", title: "Written Expression Practice", desc: "AI marks written responses for structure, vocabulary and persuasive impact — just like real markers." },
      { icon: "🗓️", title: "Study Plans", desc: "8, 12 and 16-week structured study plans with daily tasks tailored to the exam date." },
    ],
    sampleQuestion: {
      text: "Which shape comes next in the sequence? ◆ ◆◆ ◆◆◆ ___",
      options: ["◆◆◆◆", "◆◆◆◆◆", "◆◆", "◆◆◆"],
      correctIndex: 0,
    },
    testimonials: [
      { name: "Jennifer L.", location: "Perth, WA", quote: "My daughter received a full scholarship to her dream school. The abstract reasoning training was the key differentiator.", rating: 5, avatar: "Jennifer" },
      { name: "Michael T.", location: "Adelaide, SA", quote: "We tried three other platforms. ScholarDrill is the only one that actually matched the real scholarship exam difficulty.", rating: 5, avatar: "Michael" },
      { name: "Anika P.", location: "Canberra, ACT", quote: "The percentile tracking kept my son motivated. He could see himself improving week by week.", rating: 5, avatar: "Anika" },
    ],
    faqs: [
      { q: "Which scholarship exams does ScholarDrill cover?", a: "We cover ACER, Edutest, and school-specific scholarship tests used by most Australian independent and Catholic schools." },
      { q: "When should we start preparing?", a: "We recommend starting 12–16 weeks before the exam. Our structured study plans guide you through exactly what to practise each week." },
      { q: "Can my child use ScholarDrill alongside a tutor?", a: "Absolutely. Many families use ScholarDrill as a daily practice supplement to their weekly tutoring sessions." },
      { q: "How is ScholarDrill different from past papers?", a: "Past papers are static. ScholarDrill adapts to your child's weaknesses, provides instant AI explanations, and tracks improvement over time." },
    ],
  },
  {
    slug: "selective-school-test-prep",
    seoTitle: "Selective School Test Preparation Australia | ScholarDrill",
    seoDescription: "Prepare for the Selective High School Placement Test with AI-powered practice. Covering NSW, VIC & QLD selective exams. Start your free diagnostic today.",
    badge: "🏫 Selective School Specialists",
    headline: "Get Into Your Dream Selective School With Targeted Practice",
    subheadline: "AI-powered preparation for NSW, VIC and QLD selective school entry tests. Thousands of practice questions, real test simulations and expert guidance.",
    primaryCta: "Start Free Selective Diagnostic",
    accentColor: "violet",
    stats: [
      { value: "3,200+", label: "Selective Placements" },
      { value: "NSW / VIC / QLD", label: "All States Covered" },
      { value: "Top 10%", label: "Average Student Score" },
      { value: "Free", label: "Diagnostic Test" },
    ],
    features: [
      { icon: "🏆", title: "State-Specific Tests", desc: "Tailored practice for NSW HSPT, VIC SELECT and QLD selective processes — different states, different formats." },
      { icon: "🧮", title: "Thinking Skills Training", desc: "Mathematical reasoning, spatial reasoning and verbal reasoning — the three pillars of selective entry." },
      { icon: "📝", title: "Writing Portfolio Prep", desc: "Build a strong creative and persuasive writing portfolio with AI feedback on every submission." },
      { icon: "🔬", title: "Diagnostic Profiling", desc: "Our free diagnostic identifies your child's exact skill gaps across all five selective test domains." },
      { icon: "🎮", title: "Game-Based Learning", desc: "Students earn XP, unlock levels and collect badges — study feels like a game, not a chore." },
      { icon: "📊", title: "Benchmarking Reports", desc: "Parent reports show exactly where your child sits relative to selective school applicants statewide." },
    ],
    sampleQuestion: {
      text: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles?",
      options: ["True", "False", "Cannot be determined", "Only sometimes"],
      correctIndex: 0,
    },
    testimonials: [
      { name: "Lily C.", location: "Sydney, NSW", quote: "My son got into James Ruse. I genuinely believe ScholarDrill was the single biggest factor. Worth every cent.", rating: 5, avatar: "Lily" },
      { name: "Robert N.", location: "Melbourne, VIC", quote: "The VIC-specific content is excellent. No other platform I found had this level of state-specific detail.", rating: 5, avatar: "Robert" },
      { name: "Hana S.", location: "Brisbane, QLD", quote: "The thinking skills modules improved my daughter's reasoning speed dramatically. She flew through the actual test.", rating: 5, avatar: "Hana" },
    ],
    faqs: [
      { q: "Does ScholarDrill cover NSW, VIC and QLD selective tests?", a: "Yes. We have state-specific question banks and simulations for all three major selective school systems." },
      { q: "My child is in Year 5. Is it too early to start?", a: "Not at all. Many families start in Year 5 to build a strong foundation. The earlier you start, the more improvement you see." },
      { q: "How many practice questions are available?", a: "We have over 8,000 selective school practice questions across Maths, Reading, Writing, Thinking Skills and General Ability." },
      { q: "Can we track improvement over time?", a: "Yes. The parent dashboard shows score trends across every session, plus a predicted ranking score updated weekly." },
    ],
  },
  {
    slug: "vic-selective-entry-prep",
    seoTitle: "VIC Selective Entry Test Preparation | ScholarDrill",
    seoDescription: "Prepare for Victorian Selective Entry High School exams with ACER-style practice for Maths, Quantitative Reasoning, Reading, Verbal Reasoning and Writing. Start free.",
    badge: "VIC Selective Entry Specialists",
    headline: "Prepare for VIC Selective Entry With Targeted ACER-Style Practice",
    subheadline: "Built for Melbourne and regional Victorian students preparing for selective entry high school exams, including maths, quantitative reasoning, reading, verbal reasoning and writing.",
    primaryCta: "Start Free VIC Selective Diagnostic",
    accentColor: "violet",
    stats: [
      { value: "5 Domains", label: "Full VIC Coverage" },
      { value: "Year 8-9", label: "Entry Pathway" },
      { value: "ACER-Style", label: "Exam Structure" },
      { value: "Free", label: "Diagnostic Test" },
    ],
    features: [
      { icon: "VIC", title: "Victorian Exam Pathway", desc: "Practice is structured around the VIC selective entry format rather than generic selective school questions." },
      { icon: "QR", title: "Quantitative Reasoning", desc: "Train number patterns, logic, data, proportional reasoning and multi-step problem solving under timed conditions." },
      { icon: "VR", title: "Verbal Reasoning", desc: "Build speed with vocabulary, word relationships, inference and deduction questions." },
      { icon: "RW", title: "Reading and Writing", desc: "Prepare for comprehension, text analysis and written expression with AI feedback and clear rubrics." },
      { icon: "XP", title: "Motivating Daily Practice", desc: "XP, daily quests and streaks help students keep momentum during the long preparation window." },
      { icon: "AI", title: "AI Coach Guidance", desc: "The AI tutor uses recent practice data to recommend the next weakest skill and explain mistakes in plain language." },
    ],
    sampleQuestion: {
      text: "A sequence begins 4, 9, 19, 39. If the same rule continues, what is the next number?",
      options: ["59", "69", "79", "89"],
      correctIndex: 2,
    },
    testimonials: [
      { name: "Michelle L.", location: "Box Hill, VIC", quote: "ScholarDrill helped my daughter prepare for a top Melbourne selective high school. The VIC-specific reasoning practice made the biggest difference.", rating: 5, avatar: "Michelle" },
      { name: "Arjun P.", location: "Glen Waverley, VIC", quote: "The quantitative reasoning sets felt much closer to the ACER-style practice we needed than the generic worksheets we had been using.", rating: 5, avatar: "Arjun" },
      { name: "Helen R.", location: "Geelong, VIC", quote: "The parent dashboard made it obvious where my son was losing marks, and the AI coach gave him a simple plan for the next week.", rating: 5, avatar: "Helen" },
    ],
    faqs: [
      { q: "Does this page focus specifically on VIC selective entry?", a: "Yes. This pathway is designed for Victorian selective entry preparation, including mathematics, quantitative reasoning, reading, verbal reasoning and writing-style skills." },
      { q: "Is it suitable for students outside Melbourne?", a: "Yes. The content is useful for Victorian students in Melbourne, Geelong, Ballarat, Bendigo and regional areas preparing for selective entry-style assessments." },
      { q: "Can parents track readiness?", a: "Yes. Parent reports show accuracy by subject, weak topics, recent activity and recommended next steps." },
      { q: "Can it be used with tutoring?", a: "Yes. Students can practise between tutoring sessions, then share progress reports so tutors can focus on the most important gaps." },
    ],
  },
  {
    slug: "year-5-maths-practice",
    seoTitle: "Year 5 Maths Practice Tests Australia | ScholarDrill",
    seoDescription: "Year 5 Maths practice tests aligned to the Australian Curriculum. Fractions, decimals, geometry and more. AI feedback, parent reports. Start free.",
    badge: "📐 Australian Curriculum Aligned · Year 5",
    headline: "Year 5 Maths Made Manageable — Practice That Actually Works",
    subheadline: "Curriculum-aligned maths practice for Australian Year 5 students. Fractions, decimals, geometry, measurement and statistics — all in one place.",
    primaryCta: "Start Free Year 5 Maths Test",
    accentColor: "green",
    stats: [
      { value: "2,400+", label: "Year 5 Maths Questions" },
      { value: "8 Topics", label: "Curriculum Areas" },
      { value: "+23%", label: "Average Score Increase" },
      { value: "AC v9", label: "Curriculum Aligned" },
    ],
    features: [
      { icon: "➗", title: "Fractions & Decimals", desc: "Step-by-step guided practice with worked examples for the most commonly misunderstood Year 5 topics." },
      { icon: "📐", title: "Geometry & Measurement", desc: "Interactive shape identification, area, perimeter and volume questions with visual diagrams." },
      { icon: "📊", title: "Data & Statistics", desc: "Practice reading graphs, tables and interpreting data sets — a growing part of the Year 5 curriculum." },
      { icon: "🔢", title: "Number & Algebra", desc: "Place value, multiplication, division and early algebraic patterns fully covered." },
      { icon: "💡", title: "Instant Worked Solutions", desc: "Every question includes a detailed worked solution so students understand the 'why', not just the answer." },
      { icon: "📋", title: "Curriculum Reporting", desc: "Reports mapped directly to Australian Curriculum achievement standards — useful for parent-teacher meetings." },
    ],
    sampleQuestion: {
      text: "A rectangle has a length of 12 cm and a width of 7 cm. What is the area of the rectangle?",
      options: ["38 cm²", "84 cm²", "19 cm²", "76 cm²"],
      correctIndex: 1,
    },
    testimonials: [
      { name: "Emma B.", location: "Melbourne, VIC", quote: "My daughter went from struggling to confident in fractions in just 3 weeks. The worked solutions are brilliant.", rating: 5, avatar: "Emma" },
      { name: "Chris W.", location: "Sydney, NSW", quote: "Finally a maths platform that matches exactly what they're learning at school. The curriculum alignment is perfect.", rating: 5, avatar: "Chris" },
      { name: "Fatima A.", location: "Perth, WA", quote: "My son actually asks to do ScholarDrill maths now. That is something I never expected to say!", rating: 5, avatar: "Fatima" },
    ],
    faqs: [
      { q: "Is the content aligned to the new Australian Curriculum v9?", a: "Yes. All Year 5 maths content is mapped to the Australian Curriculum v9 achievement standards." },
      { q: "What topics are covered?", a: "We cover all Year 5 maths strands: Number & Algebra, Measurement & Geometry, and Statistics & Probability." },
      { q: "How long should my child practice each day?", a: "We recommend 15–20 minutes daily. Our Daily Quest system keeps sessions focused and rewarding." },
      { q: "Can I see what my child is working on?", a: "Yes. The parent dashboard shows which topics your child has attempted, their accuracy rate and improvement trends." },
    ],
  },
  {
    slug: "icas-english-practice",
    seoTitle: "ICAS English Practice Tests Australia | ScholarDrill",
    seoDescription: "Prepare for ICAS English with AI-powered practice tests. Reading, writing and language conventions for Years 3–10. Realistic format, instant feedback. Start free.",
    badge: "📚 ICAS Exam Specialists",
    headline: "Master ICAS English — Practice Tests That Match the Real Thing",
    subheadline: "Comprehensive ICAS English preparation for Years 3–10. Reading comprehension, written expression and language conventions — with AI-powered scoring.",
    primaryCta: "Start Free ICAS English Diagnostic",
    accentColor: "rose",
    stats: [
      { value: "1,800+", label: "ICAS English Questions" },
      { value: "Years 3–10", label: "All Levels Covered" },
      { value: "High Distinction", label: "Avg Student Target" },
      { value: "AI-Marked", label: "Written Responses" },
    ],
    features: [
      { icon: "📖", title: "Reading Comprehension", desc: "Challenging passages with ICAS-style multiple choice questions that test inference, vocabulary and analysis." },
      { icon: "✍️", title: "Written Expression", desc: "AI-powered marking of creative and persuasive writing, scored on the same criteria ICAS markers use." },
      { icon: "🔤", title: "Language Conventions", desc: "Spelling, grammar, punctuation and sentence structure questions matching ICAS difficulty and format." },
      { icon: "📈", title: "Medal Predictions", desc: "Our AI predicts whether your child is on track for High Distinction, Distinction, Credit or Merit." },
      { icon: "🗂️", title: "Year-Level Filtering", desc: "Practice questions are filtered by year level so the difficulty is always appropriate and challenging." },
      { icon: "🔁", title: "Unlimited Attempts", desc: "Retry any practice test as many times as needed to build speed, accuracy and confidence." },
    ],
    sampleQuestion: {
      text: "Read the sentence: 'The ancient castle, perched atop the misty hill, commanded a breathtaking view of the valley below.' The word 'commanded' is used here to suggest the castle:",
      options: ["Was a military fortress", "Had an impressive, dominant presence", "Was giving orders", "Was recently built"],
      correctIndex: 1,
    },
    testimonials: [
      { name: "Grace O.", location: "Sydney, NSW", quote: "My daughter got High Distinction in ICAS English. The reading comprehension practice was the deciding factor.", rating: 5, avatar: "Grace" },
      { name: "James P.", location: "Brisbane, QLD", quote: "The AI writing feedback is remarkable. It gives the same kind of specific advice a good teacher would.", rating: 5, avatar: "James" },
      { name: "Mei L.", location: "Melbourne, VIC", quote: "We had 4 weeks to prepare. ScholarDrill got us there. The ICAS-style questions are extremely accurate.", rating: 5, avatar: "Mei" },
    ],
    faqs: [
      { q: "Which year levels of ICAS English are covered?", a: "We cover Years 3 through 10, matching all ICAS English paper levels from Paper A to Paper G." },
      { q: "How does the AI mark written responses?", a: "Our AI is trained on thousands of marked student writing samples and evaluates structure, vocabulary, grammar and task response — the same criteria used by official ICAS markers." },
      { q: "How close are the questions to the real ICAS exam?", a: "Very close. Our question writers are former ICAS markers and Australian literacy specialists." },
      { q: "How early before ICAS should we start?", a: "6–8 weeks gives most students excellent results. Start with the free diagnostic to identify the key areas to focus on." },
    ],
  },
  {
    slug: "vce-english-exam-prep",
    seoTitle: "VCE English Exam Prep 2025 | ScholarDrill",
    seoDescription: "Comprehensive VCE English preparation. Text response, comparative analysis, language analysis and creative writing. AI-powered feedback, study plans. Start free.",
    badge: "📘 VCE Specialists · VCAA Aligned",
    headline: "Score 40+ in VCE English — AI-Powered Prep That Delivers Results",
    subheadline: "Complete VCE English Units 1–4 preparation. Text response, comparative analysis, language analysis and creative writing — all with detailed AI feedback.",
    primaryCta: "Start Free VCE English Diagnostic",
    accentColor: "indigo",
    stats: [
      { value: "Study Score 40+", label: "Average Outcome" },
      { value: "4 Task Types", label: "Full Coverage" },
      { value: "AI Marked", label: "Essay Feedback" },
      { value: "VCAA Aligned", label: "Criteria-Based Scoring" },
    ],
    features: [
      { icon: "📝", title: "Text Response Practice", desc: "Write and submit text response essays. AI provides criterion-level feedback matching the official VCAA marking guide." },
      { icon: "🔍", title: "Comparative Analysis", desc: "Practise comparing texts with structured scaffolds, model responses and AI feedback on argument development." },
      { icon: "📰", title: "Language Analysis", desc: "Develop the skills to identify and analyse persuasive language techniques — a key VCE skill often underestimated." },
      { icon: "🎨", title: "Creative Writing", desc: "Build creative writing skills with mentor text analysis, planning templates and scored practice submissions." },
      { icon: "📚", title: "Text Library", desc: "Study notes and key quotes for the most common VCE English and EAL/D text pairings." },
      { icon: "🗓️", title: "SAC & Exam Countdown Plans", desc: "Structured study plans that align to your SAC and end-of-year exam calendar, updated weekly." },
    ],
    sampleQuestion: {
      text: "In the article 'Australia's Housing Crisis: Who Is Really to Blame?', the author uses the phrase 'generation locked out' to primarily:",
      options: ["Describe a new government policy", "Evoke sympathy and create a sense of injustice", "Explain property market data", "Quote a housing expert"],
      correctIndex: 1,
    },
    testimonials: [
      { name: "Sophie T.", location: "Melbourne, VIC", quote: "I went from a raw score of 32 to 44. The essay feedback from the AI is genuinely more detailed than what I got from my teacher.", rating: 5, avatar: "Sophie" },
      { name: "Liam G.", location: "Geelong, VIC", quote: "The language analysis framework they teach is exactly what the markers want to see. My scores jumped immediately.", rating: 5, avatar: "Liam" },
      { name: "Zara M.", location: "Ballarat, VIC", quote: "Having AI-marked practice essays available at 11pm the night before my SAC was an absolute lifesaver.", rating: 5, avatar: "Zara" },
    ],
    faqs: [
      { q: "Does this cover both Units 1/2 and Units 3/4?", a: "Yes. We have content and practice tasks for VCE English Units 1, 2, 3 and 4, as well as EAL/D variants." },
      { q: "How does AI essay marking work?", a: "You submit your essay and our AI analyses it against VCAA criteria — Knowledge & Understanding, Analysis and Use of Metalanguage, and Textual Evidence — giving a criterion score and specific improvement suggestions." },
      { q: "Which texts are supported?", a: "We support the most commonly studied VCE texts, including those from the current VCAA text list. New texts are added each year." },
      { q: "Can I use this alongside school?", a: "Absolutely. Most students use ScholarDrill to get extra essay practice outside class. The AI feedback fills in the gap when a teacher can't mark every draft." },
    ],
  },
];
