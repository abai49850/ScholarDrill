import { Sparkles, ArrowRight, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AiRecommendationsPanel = () => {
  return (
    <div className="bg-primary/5 border border-primary/20 shadow-sm rounded-[2rem] p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between h-full">
      {/* Decorative gradient */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="h-4 w-4" /> AI Teacher Summary
        </div>
        
        <h3 className="text-xl font-bold mb-4">Leo is on track for Selective Entry, but needs focus on Spelling.</h3>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          Leo has shown remarkable improvement in <strong className="text-foreground">Numeracy (Top 10%)</strong> over the past two weeks, completing 45 modules. However, his accuracy in <strong className="text-foreground">Spelling Conventions</strong> has slightly dipped. To maintain his current trajectory for the upcoming selective exams, targeted practice is recommended.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3 bg-background/50 rounded-xl p-4 border border-border/50">
            <div className="p-2 bg-success/10 rounded-lg shrink-0 mt-0.5">
              <BookOpen className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="font-semibold text-sm">Strongest Area: Algebra</p>
              <p className="text-xs text-muted-foreground">Consistently scoring above 90%.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-background/50 rounded-xl p-4 border border-border/50">
            <div className="p-2 bg-orange-500/10 rounded-lg shrink-0 mt-0.5">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-sm">Priority Area: Homophones</p>
              <p className="text-xs text-muted-foreground">Struggling with 'their/there/they're'.</p>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full sm:w-auto self-start rounded-xl group mt-auto shadow-sm">
        Assign Targeted Practice
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};
