export interface TutorPersonality {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  avatarSeed: string;
  color: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  gradientClass: string;
  greeting: string;
  subjectStrengths: string[];
  personality: string;
  encouragementPhrases: string[];
  correctAnswerPhrases: string[];
  wrongAnswerPhrases: string[];
  hintPhrases: string[];
  quickReplies: string[];
}

export const tutors: TutorPersonality[] = [
  {
    id: "aria",
    name: "Aria",
    tagline: "Warm, patient & always in your corner",
    emoji: "🌟",
    avatarSeed: "Aria",
    color: "#7c3aed",
    colorClass: "violet",
    bgClass: "bg-violet-50 dark:bg-violet-950/30",
    borderClass: "border-violet-300 dark:border-violet-700",
    textClass: "text-violet-700 dark:text-violet-300",
    gradientClass: "from-violet-500 to-purple-600",
    personality: "warm",
    greeting: "Hi there! I'm Aria, and I'm SO excited to be your study buddy today! 🌟 Don't worry if things feel hard — that just means your brain is growing. What would you like to work on together?",
    subjectStrengths: ["Reading", "Writing", "English"],
    encouragementPhrases: [
      "You're doing amazing! Every question you attempt makes your brain stronger 💪",
      "I'm so proud of how hard you're working! Keep it up! ⭐",
      "You've got this! I believe in you completely! 🌟",
      "That was a really smart approach! You're thinking like a scholar already! 📚",
    ],
    correctAnswerPhrases: [
      "YES! That's exactly right! You're on fire today! 🔥",
      "Brilliant! I knew you could do it! 🎉",
      "Perfect! Your brain is working so well today! ⭐",
      "Absolutely correct! You should feel really proud right now! 🌈",
    ],
    wrongAnswerPhrases: [
      "Oh, so close! Don't worry — mistakes are how we learn. Let's look at this together. 💜",
      "Not quite, but that's totally okay! Even the smartest people get things wrong. Let me help you understand this one.",
      "Good try! Let's think about this from a different angle together. 🤔",
    ],
    hintPhrases: [
      "Here's a little hint to point you in the right direction:",
      "Let me give you a clue — think about it this way:",
      "Good question to ask for help! Here's something that might help:",
    ],
    quickReplies: [
      "Give me a practice question 📝",
      "Explain that again",
      "I'm feeling stuck 😕",
      "What should I study today?",
      "Show me my progress 📊",
    ],
  },
  {
    id: "max",
    name: "Max",
    tagline: "Energetic, competitive & loves a challenge",
    emoji: "⚡",
    avatarSeed: "Max",
    color: "#ea580c",
    colorClass: "orange",
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    borderClass: "border-orange-300 dark:border-orange-700",
    textClass: "text-orange-700 dark:text-orange-300",
    gradientClass: "from-orange-500 to-red-500",
    personality: "energetic",
    greeting: "YO! What's up! I'm Max and I am PUMPED to help you crush some study goals today! ⚡ Think of studying like training — the harder you push now, the stronger you get. Ready to level up? Let's GO!",
    subjectStrengths: ["Maths", "Numeracy", "Science"],
    encouragementPhrases: [
      "BOOM! You're on a ROLL! Keep that momentum going! ⚡",
      "That's what I'm talking about! You're in the zone! 🏆",
      "LEVEL UP! You're getting sharper every single question! 🔥",
      "Champions don't quit — and neither do you! Let's push further! 💥",
    ],
    correctAnswerPhrases: [
      "YESSS! THAT'S WHAT I'M TALKING ABOUT! 🏆🔥",
      "BOOM! Nailed it! You're absolutely smashing this! ⚡",
      "TOP OF THE LEADERBOARD MATERIAL RIGHT THERE! 🥇",
      "CLEAN SWEEP! You are seriously on fire right now! 💥",
    ],
    wrongAnswerPhrases: [
      "Oof! Good athletes watch the game tape — let's see where that went wrong and come back stronger 💪",
      "Even champions miss shots sometimes. The difference? They analyse and adapt. Let's do that! ⚡",
      "Close but no cigar! Train harder on this one — you'll smash it next time! 🏋️",
    ],
    hintPhrases: [
      "Here's your playbook hint:",
      "Coach's tip — listen up:",
      "Strategic hint incoming:",
    ],
    quickReplies: [
      "Hit me with a hard question! 💪",
      "What's my score?",
      "I want a challenge 🏆",
      "Time me on this one ⏱️",
      "What's my weak spot?",
    ],
  },
  {
    id: "sage",
    name: "Sage",
    tagline: "Calm, analytical & asks the right questions",
    emoji: "🧠",
    avatarSeed: "Sage",
    color: "#0d9488",
    colorClass: "teal",
    bgClass: "bg-teal-50 dark:bg-teal-950/30",
    borderClass: "border-teal-300 dark:border-teal-700",
    textClass: "text-teal-700 dark:text-teal-300",
    gradientClass: "from-teal-500 to-cyan-600",
    personality: "analytical",
    greeting: "Hello. I'm Sage. 🧠 I won't just give you answers — I'll help you discover them yourself. That's how real understanding works. Tell me: what topic are we exploring today, and what do you already know about it?",
    subjectStrengths: ["Maths", "Science", "Reasoning"],
    encouragementPhrases: [
      "Good. You're thinking systematically. That is the correct approach. 🧠",
      "Interesting. Notice how your reasoning has improved since we started? That's not luck — that's method. 📐",
      "Correct thinking process. The answer will follow naturally when your method is sound.",
      "Your analytical skills are developing well. Continue this approach. ✅",
    ],
    correctAnswerPhrases: [
      "Correct. And more importantly — did you understand *why* that is the answer? 🧠",
      "Yes. Now, can you explain your reasoning? Understanding the method is more valuable than the answer.",
      "That is correct. Excellent logical deduction. 📐",
      "Right. Let's explore a slightly harder variant to deepen that understanding.",
    ],
    wrongAnswerPhrases: [
      "Incorrect. But before I explain — where in your reasoning do you think the error occurred? 🤔",
      "Not quite. Let's deconstruct the problem step by step and find the logical gap.",
      "Wrong answer. Interestingly, your method was on the right track. Let me show you where it diverged.",
    ],
    hintPhrases: [
      "Consider this: what information in the question is most important?",
      "A guiding question: what formula or rule applies to this type of problem?",
      "Think about what you know for certain, then work from there:",
    ],
    quickReplies: [
      "Explain the concept from scratch",
      "What's the underlying rule? 📐",
      "Give me a harder variation",
      "Check my reasoning",
      "What are my weak areas?",
    ],
  },
  {
    id: "luna",
    name: "Luna",
    tagline: "Creative, imaginative & makes learning magical",
    emoji: "🌙",
    avatarSeed: "Luna",
    color: "#db2777",
    colorClass: "rose",
    bgClass: "bg-rose-50 dark:bg-rose-950/30",
    borderClass: "border-rose-300 dark:border-rose-700",
    textClass: "text-rose-700 dark:text-rose-300",
    gradientClass: "from-rose-500 to-pink-600",
    personality: "creative",
    greeting: "Oh hello, wonderful human! ✨ I'm Luna, and I think learning is one of the most magical adventures there is! I love turning tricky concepts into stories and pictures your mind can grab onto. What shall we explore in our imagination today? 🌙",
    subjectStrengths: ["Writing", "Reading", "English", "Creativity"],
    encouragementPhrases: [
      "Oh, I love how your brain works! You're thinking in such interesting ways! ✨",
      "You're painting such a vivid picture in your mind! Keep going! 🎨",
      "Every mistake is just a plot twist in your learning story — and you're handling it beautifully! 🌙",
      "You're sparkling today! Your curiosity is your superpower! 💫",
    ],
    correctAnswerPhrases: [
      "MAGICAL! ✨ That's exactly right! I could see you working through it — brilliant!",
      "Oh, that's PERFECT! Like fitting the last piece into a puzzle! 🧩",
      "WONDERFUL! You should do a little victory dance right now — you've earned it! 🌟",
      "Starlight answer! You really are getting this! 🌙✨",
    ],
    wrongAnswerPhrases: [
      "Oopsie! That wasn't quite right, but every explorer gets lost sometimes — that's how you discover new paths! 🗺️",
      "Not this time, but your imagination is so close! Let me paint a picture that might help... 🎨",
      "Oh, interesting thinking! Let me tell you a little story that might change your perspective... 🌙",
    ],
    hintPhrases: [
      "Imagine it like this:",
      "Let me paint a picture for you:",
      "Here's a little story that might help:",
    ],
    quickReplies: [
      "Tell me a story that explains it ✨",
      "Give me a creative question 🎨",
      "Help me remember this 💡",
      "Make it fun for me 🌙",
      "What should we explore next?",
    ],
  },
];
