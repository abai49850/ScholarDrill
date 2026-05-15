import { motion } from "framer-motion";
import { Zap, Check, Target, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockQuests = [
  { id: 1, title: "Numeracy Ninja", desc: "Complete 20 maths questions.", progress: 15, target: 20, xp: 50, claimed: false },
  { id: 2, title: "Perfect Run", desc: "Get 10 questions right in a row.", progress: 10, target: 10, xp: 100, claimed: true },
  { id: 3, title: "Reading Explorer", desc: "Read 2 comprehension texts.", progress: 0, target: 2, xp: 75, claimed: false },
];

export const DailyQuestsWidget = () => {
  return (
    <div className="bg-card border-b-4 border-r-4 border-l border-t border-border rounded-3xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          Daily Quests
        </h3>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-1 rounded-lg">Resets in 4h</span>
      </div>

      <div className="space-y-4 flex-1">
        {mockQuests.map((quest) => {
          const isComplete = quest.progress >= quest.target;
          
          return (
            <div key={quest.id} className={`p-4 rounded-2xl border-2 relative overflow-hidden transition-all ${
              quest.claimed ? "bg-muted/30 border-border/50 opacity-70" :
              isComplete ? "bg-success/5 border-success/30 shadow-sm" : "bg-background border-border"
            }`}>
              {/* Claimed overlay */}
              {quest.claimed && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10">
                  <span className="bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Check className="h-3 w-3" /> Claimed
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${isComplete && !quest.claimed ? "text-success" : ""}`}>{quest.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-3">{quest.desc}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-success" : "bg-primary"}`}
                        style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground w-8 text-right">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center justify-center border-l-2 border-border/50 pl-4">
                  <span className="text-sm font-black text-yellow-600 mb-1">+{quest.xp} XP</span>
                  {isComplete && !quest.claimed ? (
                    <Button size="sm" className="h-7 text-xs px-3 rounded-lg bg-success hover:bg-success/90 shadow-md transform hover:-translate-y-0.5 transition-transform">
                      Claim
                    </Button>
                  ) : (
                    <div className="h-7 flex items-center justify-center">
                      <Gift className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
