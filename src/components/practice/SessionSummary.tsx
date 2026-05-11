import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, TrendingUp, RotateCcw, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface SessionResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

interface SessionSummaryProps {
  results: SessionResult[];
  totalTime: number;
  onRestart: () => void;
  isFree?: boolean;
}

export function SessionSummary({ results, totalTime, onRestart, isFree = false }: SessionSummaryProps) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const avgTime = Math.round(totalTime / total);

  const getGrade = () => {
    if (pct >= 90) return { emoji: "🏆", label: "Outstanding!", color: "text-success" };
    if (pct >= 70) return { emoji: "⭐", label: "Great work!", color: "text-primary" };
    if (pct >= 50) return { emoji: "💪", label: "Good effort!", color: "text-[hsl(var(--subject-reasoning))]" };
    return { emoji: "📚", label: "Keep practising!", color: "text-accent" };
  };

  const grade = getGrade();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-6xl mb-4"
      >
        {grade.emoji}
      </motion.div>
      <h2 className={`text-display mb-2 ${grade.color}`}>{grade.label}</h2>
      <p className="text-muted-foreground mb-8">You completed {total} questions</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { icon: Trophy, label: "Score", value: `${pct}%`, sub: `${correct}/${total} correct` },
          { icon: Target, label: "Accuracy", value: `${correct}`, sub: `out of ${total}` },
          { icon: Clock, label: "Avg Time", value: `${avgTime}s`, sub: "per question" },
          { icon: TrendingUp, label: "Total Time", value: `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`, sub: "session" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {isFree && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-left"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-semibold">Unlock the full question library</p>
              <p className="text-sm text-muted-foreground mt-1">
                You're on the free plan — one practice set per day with the same 10 curated
                questions. Upgrade to <strong>Pro</strong> for unlimited adaptive practice across
                every subject and year level.
              </p>
              <Button asChild variant="hero" size="sm" className="mt-3">
                <Link to="/info/pricing"><Sparkles className="w-4 h-4" /> Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3 justify-center">
        {!isFree && (
          <Button variant="hero-outline" onClick={onRestart}>
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>
        )}
        <Button variant="hero" asChild>
          <Link to="/dashboard"><Home className="w-4 h-4" /> Dashboard</Link>
        </Button>
      </div>
    </motion.div>
  );
}
