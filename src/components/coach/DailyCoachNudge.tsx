import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BotMessageSquare, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { tutors } from "@/data/tutors";

export const DailyCoachNudge = () => {
  const [dismissed, setDismissed] = useState(false);
  // Pick a random tutor for the nudge each session
  const tutor = tutors[Math.floor(Date.now() / 86400000) % tutors.length];

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-3xl border-2 ${tutor.bgClass} ${tutor.borderClass} overflow-hidden`}
    >
      {/* Decorative blob */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: tutor.color }}
      />

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4 text-current opacity-50" />
      </button>

      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-2xl border-2 overflow-hidden shrink-0 bg-white/50 shadow-sm"
        style={{ borderColor: tutor.color }}
      >
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.avatarSeed}&backgroundColor=transparent`}
          alt={tutor.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <p className={`font-bold text-sm ${tutor.textClass} mb-0.5`}>
          {tutor.emoji} {tutor.name} is waiting for you!
        </p>
        <p className={`text-sm leading-snug ${tutor.textClass} opacity-80`}>
          You haven't checked in with your AI study coach today. A quick 10-minute session can make a big difference!
        </p>
      </div>

      {/* CTA */}
      <Link
        to="/coach"
        className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r ${tutor.gradientClass} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}
      >
        <BotMessageSquare className="h-4 w-4" />
        Chat with {tutor.name}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
};
