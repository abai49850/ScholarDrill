import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export const ExamReadinessRing = ({ score = 85, trend = "+5%" }: { score?: number, trend?: string }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border border-border shadow-sm rounded-[2rem] p-6 relative overflow-hidden flex flex-col items-center justify-center">
      <h3 className="font-semibold text-muted-foreground w-full text-left mb-6">Exam Readiness</h3>
      
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted/30"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={score >= 80 ? "text-success" : score >= 50 ? "text-orange-500" : "text-destructive"}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black">{score}%</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-success bg-success/10 px-3 py-1 rounded-full">
        <TrendingUp className="h-4 w-4" />
        {trend} this week
      </div>
    </div>
  );
};
