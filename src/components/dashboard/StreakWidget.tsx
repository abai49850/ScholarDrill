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
        {viewMode === "week" ? (
          <div className="flex items-end justify-between gap-1 sm:gap-2 h-24 mt-4">
            {activityData.map((day, i) => {
              const height = (day.count / maxCount) * 100;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                    className="w-full rounded-t bg-primary/20 min-h-[4px] relative group"
                  >
                    <div
                      className="absolute bottom-0 w-full rounded-t bg-primary"
                      style={{ height: day.count >= dailyGoal ? "100%" : "60%" }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 w-max px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded shadow-md pointer-events-none">
                      {day.count} Qs
                    </div>
                  </motion.div>
                  <span className="text-[10px] text-muted-foreground">{day.day}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col mt-4">
            <div className="grid grid-cols-7 gap-1.5">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] text-muted-foreground mb-1">{d}</div>
              ))}
              
              {activityData.length > 0 && Array.from({ length: new Date(activityData[0].date).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {activityData.map((day, i) => {
                const intensity = day.count === 0 
                  ? "bg-secondary/50" 
                  : day.count >= dailyGoal 
                    ? "bg-primary" 
                    : day.count >= dailyGoal * 0.5 
                      ? "bg-primary/70" 
                      : "bg-primary/40";
                
                return (
                  <motion.div
                    key={day.date}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.01 }}
                    className={`aspect-square rounded-sm ${intensity} relative group cursor-pointer`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 w-max px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded shadow-md pointer-events-none">
                      {day.count} Qs on {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground mt-4">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-secondary/50" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/70" />
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span>More</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
