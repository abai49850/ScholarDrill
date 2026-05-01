import { motion } from "framer-motion";
import { Flame, Target, Trophy, Zap } from "lucide-react";
import type { UserStats } from "@/lib/statsApi";

interface Props {
  stats: UserStats;
  dailyGoal: number;
}

export function StreakWidget({ stats, dailyGoal }: Props) {
  const { currentStreak, longestStreak, todayCount, weeklyActivity } = stats;
  const goalProgress = Math.min((todayCount / dailyGoal) * 100, 100);
  const maxCount = Math.max(...weeklyActivity.map((d) => d.count), 1);

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
        <h4 className="text-sm font-medium mb-4">This Week</h4>
        <div className="flex items-end justify-between gap-2 h-24">
          {weeklyActivity.map((day, i) => {
            const height = (day.count / maxCount) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                  className="w-full rounded-t-lg bg-primary/20 min-h-[4px] relative"
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t-lg bg-primary"
                    style={{ height: day.count >= dailyGoal ? "100%" : "60%" }}
                  />
                </motion.div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
