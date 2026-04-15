import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface ExplanationPanelProps {
  explanation: string;
  isCorrect: boolean;
  visible: boolean;
}

export function ExplanationPanel({ explanation, isCorrect, visible }: ExplanationPanelProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: 10 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden"
        >
          <div className={`rounded-2xl p-6 border-2 ${
            isCorrect
              ? "bg-success/5 border-success/20"
              : "bg-accent/5 border-accent/20"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className={`w-5 h-5 ${isCorrect ? "text-success" : "text-accent"}`} />
              <span className={`font-bold text-sm ${isCorrect ? "text-success" : "text-accent"}`}>
                {isCorrect ? "Correct! 🎉" : "Not quite — here's why:"}
              </span>
            </div>
            <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {explanation}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
