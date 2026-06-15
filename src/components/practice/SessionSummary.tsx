import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, TrendingUp, RotateCcw, Home, Sparkles, Bot, UserPlus } from "lucide-react";
import { Link } from "@/lib/router";

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
  isGuest?: boolean;
}

export function SessionSummary({ results, totalTime, onRestart, isFree = false, isGuest = false }: SessionSummaryProps) {
  const correct = results.filter((r) => r.correct).length;
  const total = Math.max(results.length, 1);
  const pct = Math.round((correct / total) * 100);
  const avgTime = Math.round(totalTime / total);

  const getGrade = () => {
    if (pct >= 90) return { icon: Trophy, label: "Outstanding!", color: "text-success" };
    if (pct >= 70) return { icon: Sparkles, label: "Great work!", color: "text-primary" };
    if (pct >= 50) return { icon: TrendingUp, label: "Good effort!", color: "text-[hsl(var(--subject-reasoning))]" };
    return { icon: Target, label: "Keep practising!", color: "text-accent" };
  };

  const grade = getGrade();
  const GradeIcon = grade.icon;
  const coachMessage =
    pct >= 80
      ? "Strong start. Next, raise the difficulty and practise under a tighter timer."
      : pct >= 50
        ? "Good diagnostic signal. Review the missed explanations, then practise the same topic again while it is fresh."
        : "Start with a short targeted set. Focus on accuracy first, then speed once the pattern feels familiar.";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
      >
        <GradeIcon className={`h-10 w-10 ${grade.color}`} />
      </motion.div>
      <h2 className={`text-display mb-2 ${grade.color}`}>{grade.label}</h2>
      <p className="text-muted-foreground mb-6">You completed {results.length} questions</p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6 rounded-3xl border border-primary/20 bg-primary/10 p-5 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">AI coach next step</p>
            <p className="mt-1 text-sm text-muted-foreground">{coachMessage}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { icon: Trophy, label: "Score", value: `${pct}%`, sub: `${correct}/${results.length} correct` },
          { icon: Target, label: "Accuracy", value: `${correct}`, sub: `out of ${results.length}` },
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

      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-left"
        >
          <div className="flex items-start gap-3">
            <UserPlus className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-semibold">Save this progress map</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a free parent account to save results, unlock your dashboard, and continue targeted practice.
              </p>
              <Button asChild variant="hero" size="sm" className="mt-3">
                <Link to="/auth"><UserPlus className="w-4 h-4" /> Create free account</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {!isGuest && isFree && (
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
                You're on the free plan - one practice set per day with curated questions. Upgrade to
                <strong> Pro</strong> for unlimited adaptive practice across every subject and year level.
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
          <Link to={isGuest ? "/" : "/dashboard"}><Home className="w-4 h-4" /> {isGuest ? "Home" : "Dashboard"}</Link>
        </Button>
      </div>
    </motion.div>
  );
}
