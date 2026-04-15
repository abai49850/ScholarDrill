import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { subjectProgress } from "@/data/mockProgress";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const subjectIcons: Record<string, string> = {
  maths: "📐",
  reading: "📖",
  writing: "✍️",
  reasoning: "🧠",
  conventions: "✏️",
};

export function SubjectProgressCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjectProgress.map((sp, i) => {
        const chartData = sp.recentScores.map((score, idx) => ({
          day: idx,
          score,
        }));

        return (
          <motion.div
            key={sp.subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-2xl p-5 card-hover cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{subjectIcons[sp.subject]}</span>
                <h3 className="text-sm font-semibold">{sp.label}</h3>
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  sp.trend >= 0 ? "text-success" : "text-accent"
                }`}
              >
                {sp.trend >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(sp.trend)}%
              </div>
            </div>

            {/* Accuracy ring */}
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28" cy="28" r="22"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="4"
                  />
                  <circle
                    cx="28" cy="28" r="22"
                    fill="none"
                    stroke={`hsl(${sp.color})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 * (1 - sp.accuracy / 100)}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {sp.accuracy}%
                </span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">
                  {sp.questionsCorrect}/{sp.questionsAttempted} correct
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {sp.questionsAttempted} attempted
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`grad-${sp.subject}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`hsl(${sp.color})`} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={`hsl(${sp.color})`} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={`hsl(${sp.color})`}
                    strokeWidth={2}
                    fill={`url(#grad-${sp.subject})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
