import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

export const GamifiedHeader = ({ streak = 14, currentXp = 4250, nextLevelXp = 5000, level = 12 }) => {
  const { profile } = useUserProfile();
  const xpPercent = (currentXp / nextLevelXp) * 100;

  return (
    <div className="bg-card border-b-4 border-r-4 border-l border-t border-border rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-sm">
      {/* Decorative background */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      {/* Avatar Container */}
      <div className="relative shrink-0">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-background shadow-lg overflow-hidden flex items-center justify-center">
          {/* Placeholder for pre-designed 3D avatar */}
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=transparent" 
            alt="Avatar" 
            className="w-20 h-20 object-contain drop-shadow-md"
          />
        </div>
        <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-yellow-900 font-black text-sm px-3 py-1 rounded-xl border-2 border-background shadow-sm transform rotate-3">
          LVL {level}
        </div>
      </div>

      {/* Info & XP */}
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Ready to level up, {profile.name}?
            </h2>
            <p className="text-muted-foreground font-medium">Scholar Rank • Year {profile.yearLevel}</p>
          </div>
          
          <div className="flex items-center gap-3 bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/20 shrink-0">
            <Flame className="h-6 w-6 text-orange-500 fill-orange-500" />
            <div>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider leading-none">Streak</p>
              <p className="font-black text-lg text-orange-700 leading-none mt-1">{streak} Days</p>
            </div>
          </div>
        </div>

        {/* Chunky XP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end px-1">
            <span className="text-sm font-bold text-muted-foreground flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {currentXp} XP
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{nextLevelXp} XP</span>
          </div>
          <div className="h-6 w-full bg-secondary rounded-full overflow-hidden border-2 border-border/50 shadow-inner p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full relative overflow-hidden"
            >
              {/* Shine effect on progress bar */}
              <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
