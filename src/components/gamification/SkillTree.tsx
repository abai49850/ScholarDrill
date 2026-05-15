import { motion } from "framer-motion";
import { Check, Lock, BookOpen } from "lucide-react";

const nodes = [
  { id: 1, title: "Addition", status: "completed", x: 20, y: 10 },
  { id: 2, title: "Subtraction", status: "completed", x: 50, y: 10 },
  { id: 3, title: "Multiplication", status: "active", x: 35, y: 40 },
  { id: 4, title: "Division", status: "locked", x: 35, y: 70 },
  { id: 5, title: "Fractions", status: "locked", x: 70, y: 40 },
  { id: 6, title: "Decimals", status: "locked", x: 80, y: 70 },
];

export const SkillTree = () => {
  return (
    <div className="bg-card border-4 border-border rounded-3xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Numeracy Tree
        </h3>
        <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-xl border border-border/50">2/6 Modules</span>
      </div>

      <div className="relative flex-1 min-h-[400px] w-full bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-border/50 p-4 overflow-hidden">
        {/* Draw connections (simplified lines for visual) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '100%', minHeight: '100%' }}>
          <path d="M 25% 15% L 40% 45%" stroke="hsl(var(--success))" strokeWidth="4" fill="none" />
          <path d="M 55% 15% L 40% 45%" stroke="hsl(var(--success))" strokeWidth="4" fill="none" />
          <path d="M 40% 45% L 40% 75%" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeDasharray="8 8" fill="none" />
          <path d="M 40% 45% L 75% 45%" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeDasharray="8 8" fill="none" />
          <path d="M 75% 45% L 85% 75%" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeDasharray="8 8" fill="none" />
        </svg>

        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-transform group-hover:scale-110 shadow-md ${
              node.status === "completed" ? "bg-success text-white border-success-foreground" :
              node.status === "active" ? "bg-primary text-white border-primary-foreground animate-pulse" :
              "bg-muted text-muted-foreground border-border"
            }`}>
              {node.status === "completed" && <Check className="h-8 w-8" />}
              {node.status === "active" && <span className="font-black text-2xl">?</span>}
              {node.status === "locked" && <Lock className="h-6 w-6" />}
            </div>
            <span className={`mt-2 font-bold text-sm bg-background/80 px-2 py-0.5 rounded-md backdrop-blur-sm border ${
              node.status === "active" ? "border-primary text-primary" : "border-transparent text-foreground"
            }`}>
              {node.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
