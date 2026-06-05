import { motion } from "framer-motion";
import { Check, Lock, BookOpen } from "lucide-react";
import type { UserStats } from "@/lib/statsApi";

const baseNodes = [
  { id: "maths", title: "Numeracy", x: 20, y: 15 },
  { id: "reading", title: "Reading", x: 50, y: 15 },
  { id: "conventions", title: "Conventions", x: 35, y: 45 },
  { id: "writing", title: "Writing", x: 35, y: 75 },
  { id: "reasoning", title: "Reasoning", x: 70, y: 45 },
  { id: "mastery", title: "Exam Ready", x: 80, y: 75 },
];

export const SkillTree = ({ stats }: { stats: UserStats }) => {
  const subjectMap = new Map(stats.bySubject.map((subject) => [subject.subject, subject]));
  const getStatus = (id: string) => {
    if (id === "mastery") {
      return stats.overallAccuracy >= 80 && stats.totalAttempted >= 50 ? "completed" : stats.totalAttempted >= 25 ? "active" : "locked";
    }
    const subject = subjectMap.get(id);
    if (!subject || subject.attempted === 0) return stats.totalAttempted > 0 ? "active" : "locked";
    if (subject.attempted >= 10 && subject.accuracy >= 75) return "completed";
    return "active";
  };
  const completed = baseNodes.filter((node) => getStatus(node.id) === "completed").length;

  return (
    <div className="bg-card border-4 border-border rounded-3xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Learning Path
        </h3>
        <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-xl border border-border/50">
          {completed}/{baseNodes.length} Modules
        </span>
      </div>

      <div className="relative flex-1 min-h-[400px] w-full bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-border/50 p-4 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "100%", minHeight: "100%" }}>
          <path d="M 25% 18% L 40% 48%" stroke="hsl(var(--success))" strokeWidth="4" fill="none" />
          <path d="M 55% 18% L 40% 48%" stroke="hsl(var(--success))" strokeWidth="4" fill="none" />
          <path d="M 40% 48% L 40% 78%" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeDasharray="8 8" fill="none" />
          <path d="M 40% 48% L 75% 48%" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeDasharray="8 8" fill="none" />
          <path d="M 75% 48% L 85% 78%" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeDasharray="8 8" fill="none" />
        </svg>

        {baseNodes.map((node, i) => {
          const status = getStatus(node.id);
          const subject = subjectMap.get(node.id);
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-transform group-hover:scale-110 shadow-md ${
                status === "completed" ? "bg-success text-white border-success-foreground" :
                status === "active" ? "bg-primary text-white border-primary-foreground animate-pulse" :
                "bg-muted text-muted-foreground border-border"
              }`}>
                {status === "completed" && <Check className="h-8 w-8" />}
                {status === "active" && <span className="font-black text-lg">{subject?.accuracy ?? "?"}%</span>}
                {status === "locked" && <Lock className="h-6 w-6" />}
              </div>
              <span className={`mt-2 font-bold text-sm bg-background/80 px-2 py-0.5 rounded-md backdrop-blur-sm border ${
                status === "active" ? "border-primary text-primary" : "border-transparent text-foreground"
              }`}>
                {node.title}
              </span>
              {subject && <span className="text-[10px] text-muted-foreground mt-1">{subject.attempted} attempts</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
