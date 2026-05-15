import { motion } from "framer-motion";
import { Download, Share, Bell, Flame, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamReadinessRing } from "./widgets/ExamReadinessRing";
import { StudyConsistencyHeatmap } from "./widgets/StudyConsistencyHeatmap";
import { PerformanceTrendsChart } from "./widgets/PerformanceTrendsChart";
import { AiRecommendationsPanel } from "./widgets/AiRecommendationsPanel";

export const ParentPortal = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parent Portal</h2>
          <p className="text-muted-foreground">Comprehensive insights into your child's academic progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-background rounded-xl border-border/60 hover:bg-muted/50">
            <Download className="h-4 w-4" /> Download Report
          </Button>
          <Button className="gap-2 rounded-xl shadow-sm">
            <Share className="h-4 w-4" /> Share with Tutor
          </Button>
        </div>
      </div>

      {/* Notifications Alert Bar */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-xl shadow-sm">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">14-Day Streak! 🔥</p>
              <p className="text-xs text-muted-foreground">Leo has studied consistently for two weeks.</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-500/10">Celebrate</Button>
        </div>
        
        {/* Placeholder for missed study reminder (hidden for now to show positive UI, but here for structure) */}
        {/* <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-xl shadow-sm">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Missed Practice</p>
              <p className="text-xs text-muted-foreground">No activity recorded for the past 2 days.</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Send Nudge</Button>
        </div> */}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Row: Readiness & Heatmap */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ExamReadinessRing score={85} trend="+5%" />
          <StudyConsistencyHeatmap />
        </div>

        {/* Middle Area: Trends Chart */}
        <div className="lg:col-span-2">
          <PerformanceTrendsChart />
        </div>

        {/* Bottom Area: AI Recommendations */}
        <div className="lg:col-span-3">
          <AiRecommendationsPanel />
        </div>

      </div>

    </div>
  );
};
