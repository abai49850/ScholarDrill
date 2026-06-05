import { motion } from "framer-motion";
import { Trophy, Medal, Star, Flame, Target } from "lucide-react";
import type { UserStats } from "@/lib/statsApi";

export const AchievementsVault = ({ stats }: { stats: UserStats }) => {
  const maths = stats.bySubject.find((s) => s.subject === "maths");
  const reading = stats.bySubject.find((s) => s.subject === "reading");
  const achievements = [
    { id: 1, title: "First Step", desc: "Answer your first question.", icon: Star, unlocked: stats.totalAttempted >= 1, color: "text-yellow-500", bg: "bg-yellow-500/20", border: "border-yellow-500" },
    { id: 2, title: "On Fire", desc: "Reach a 7-day streak.", icon: Flame, unlocked: stats.currentStreak >= 7, color: "text-orange-500", bg: "bg-orange-500/20", border: "border-orange-500" },
    { id: 3, title: "Maths Wizard", desc: "Score 80%+ in Numeracy after 10 attempts.", icon: Target, unlocked: Boolean(maths && maths.attempted >= 10 && maths.accuracy >= 80), color: "text-blue-500", bg: "bg-blue-500/20", border: "border-blue-500" },
    { id: 4, title: "Top Scholar", desc: "Reach Level 10.", icon: Trophy, unlocked: Math.floor(stats.totalPoints / 500) + 1 >= 10, color: "text-purple-500", bg: "bg-purple-500/20", border: "border-purple-500" },
    { id: 5, title: "Reading Master", desc: "Complete 20 reading questions.", icon: Medal, unlocked: Boolean(reading && reading.attempted >= 20), color: "text-emerald-500", bg: "bg-emerald-500/20", border: "border-emerald-500" },
    { id: 6, title: "Unstoppable", desc: "Answer 50 questions correctly.", icon: Star, unlocked: stats.totalCorrect >= 50, color: "text-rose-500", bg: "bg-rose-500/20", border: "border-rose-500" },
  ];
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="bg-card border-4 border-border rounded-3xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" /> Vault
        </h3>
        <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-xl border border-border/50">{unlocked}/{achievements.length} Unlocked</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${
              badge.unlocked ? `bg-card ${badge.border} shadow-sm` : "bg-muted/30 border-border/50 opacity-60 grayscale hover:grayscale-0"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 border-2 ${
              badge.unlocked ? `${badge.bg} ${badge.color} ${badge.border}` : "bg-muted text-muted-foreground border-border"
            }`}>
              <badge.icon className="h-7 w-7" />
            </div>
            <h4 className={`font-bold text-sm leading-tight mb-1 ${badge.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{badge.title}</h4>
            <p className="text-[10px] text-muted-foreground font-medium leading-snug">{badge.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
