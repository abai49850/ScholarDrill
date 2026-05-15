import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TutorPersonality } from "@/data/tutors";

interface Props {
  tutor: TutorPersonality;
  xpGained: number;
  message: string;
  onClose: () => void;
}

export const EncouragementOverlay = ({ tutor, xpGained, message, onClose }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border-4 border-border rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
        >
          {/* Confetti decoration */}
          {["🎉", "⭐", "✨", "🎊", "💫"].map((e, i) => (
            <motion.span
              key={i}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: [-20, -80], opacity: [1, 0], x: [(i - 2) * 30] }}
              transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity, repeatDelay: 1.5 }}
              className="absolute text-2xl pointer-events-none"
              style={{ left: `${15 + i * 18}%`, top: "10%" }}
            >
              {e}
            </motion.span>
          ))}

          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-border mx-auto mb-4 bg-muted shadow-md">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.avatarSeed}&backgroundColor=transparent`}
              alt={tutor.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${tutor.bgClass} ${tutor.textClass} border ${tutor.borderClass}`}>
            {tutor.emoji} {tutor.name} says…
          </div>

          <p className="text-base font-semibold text-foreground leading-relaxed mb-6">"{message}"</p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-5 py-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-black text-xl text-yellow-600">+{xpGained} XP</span>
            </div>
          </div>

          <Button
            className={`w-full rounded-full h-12 bg-gradient-to-r ${tutor.gradientClass} text-white border-0 font-bold shadow-md`}
            onClick={onClose}
          >
            Keep Going! {tutor.emoji}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
