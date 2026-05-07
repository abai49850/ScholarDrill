import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Target, Trophy, Zap } from "lucide-react";
import type { UserStats } from "@/lib/statsApi";

interface Props {
  stats: UserStats;
  dailyGoal: number;
}

export function StreakWidget({ stats, dailyGoal }: Props) {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const { currentStreak, longestStreak, todayCount, weeklyActivity, monthlyActivity } = stats;
  const goalProgress = Math.min((todayCount / dailyGoal) * 100, 100);
  
  const activityData = viewMode === "week" ? weeklyActivity : monthlyActivity;
  const maxCount = Math.max(...activityData.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Current Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{currentStreak}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Best Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{longestStreak}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Daily Goal</span>
          </div>
          <span className="text-sm font-medium text-primary">{todayCount}/{dailyGoal} questions</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-primary"
          />
        </div>
        {goalProgress >= 100 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-success font-medium">
            <Zap className="w-3 h-3" /> Goal smashed! 🎉
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">{viewMode === "week" ? "This Week" : "This Month"}</h4>
          <div className="flex bg-secondary p-1 rounded-lg">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === "week" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === "month" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-24">
          {activityData.map((day, i) => {
            const height = (day.count / maxCount) * 100;
            // Only show labels for week mode, or occasionally for month mode to save space
            const showLabel = viewMode === "week" || i % 5 === 0 || i === activityData.length - 1;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + (viewMode === "week" ? i * 0.05 : i * 0.01) }}
                  className="w-full rounded-t bg-primary/20 min-h-[4px] relative"
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t bg-primary"
                    style={{ height: day.count >= dailyGoal ? "100%" : "60%" }}
                  />
                </motion.div>
                {showLabel ? (
                  <span className="text-[10px] text-muted-foreground">{day.day}</span>
                ) : (
                  <span className="text-[10px] text-transparent select-none">-</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
