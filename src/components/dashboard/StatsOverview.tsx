import { motion } from "framer-motion";
import { BookOpen, Target, Flame, TrendingUp } from "lucide-react";
import { subjectProgress, streakData } from "@/data/mockProgress";

export function StatsOverview() {
  const totalAttempted = subjectProgress.reduce((s, p) => s + p.questionsAttempted, 0);
  const totalCorrect = subjectProgress.reduce((s, p) => s + p.questionsCorrect, 0);
  const overallAccuracy = Math.round((totalCorrect / totalAttempted) * 100);

  const stats = [
    {
      icon: BookOpen,
      label: "Questions Practised",
      value: totalAttempted.toLocaleString(),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Target,
      label: "Overall Accuracy",
      value: `${overallAccuracy}%`,
      color: "bg-success/10 text-success",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: `${streakData.currentStreak}`,
      color: "bg-accent/10 text-accent",
    },
    {
      icon: TrendingUp,
      label: "Week Improvement",
      value: "+5%",
      color: "bg-[hsl(var(--subject-reasoning))]/10 text-[hsl(var(--subject-reasoning))]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
            <stat.icon className="w-4.5 h-4.5" />
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
