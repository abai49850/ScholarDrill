import { motion } from "framer-motion";
import type { UserStats } from "@/lib/statsApi";

export const StudyConsistencyHeatmap = ({ activity, dailyGoal = 10 }: { activity: UserStats["monthlyActivity"]; dailyGoal?: number }) => {
  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-muted/50";
      case 1: return "bg-primary/20";
      case 2: return "bg-primary/50";
      case 3: return "bg-primary/80";
      case 4: return "bg-primary";
      default: return "bg-muted/50";
    }
  };

  return (
    <div className="bg-card border border-border shadow-sm rounded-[2rem] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-muted-foreground">Study Consistency</h3>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">Last 30 Days</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-flow-col grid-rows-5 gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {activity.map((day, i) => {
            const date = new Date(day.date);
            const intensity = day.count === 0 ? 0 : Math.min(4, Math.ceil((day.count / dailyGoal) * 4));
            return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm ${getIntensityColor(intensity)} hover:ring-2 hover:ring-primary/50 cursor-pointer transition-all`}
              title={`${date.toDateString()}: ${day.count} questions`}
            />
          )})}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted/50" />
          <div className="w-3 h-3 rounded-sm bg-primary/20" />
          <div className="w-3 h-3 rounded-sm bg-primary/50" />
          <div className="w-3 h-3 rounded-sm bg-primary/80" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
