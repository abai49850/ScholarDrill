import { motion } from "framer-motion";
import { BookOpen, Target, Flame, TrendingUp, TrendingDown } from "lucide-react";
import type { UserStats } from "@/lib/statsApi";

export function StatsOverview({ stats }: { stats: UserStats }) {
  const trend = stats.weeklyTrendPct;
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;
  const items = [
    { icon: BookOpen, label: "Questions Practised", value: stats.totalAttempted.toLocaleString(), color: "bg-primary/10 text-primary" },
    { icon: Target, label: "Overall Accuracy", value: `${stats.overallAccuracy}%`, color: "bg-success/10 text-success" },
    { icon: Flame, label: "Day Streak", value: `${stats.currentStreak}`, color: "bg-accent/10 text-accent" },
    { icon: TrendIcon, label: "Week Change", value: `${trend >= 0 ? "+" : ""}${trend}%`, color: "bg-[hsl(var(--subject-reasoning))]/10 text-[hsl(var(--subject-reasoning))]" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((stat, i) => (
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
