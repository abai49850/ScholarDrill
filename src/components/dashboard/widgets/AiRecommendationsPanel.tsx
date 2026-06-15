import { useState } from "react";
import { Sparkles, ArrowRight, BookOpen, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserStats } from "@/lib/statsApi";
import type { PracticeRecommendation } from "@/lib/practiceAssignments";

export const AiRecommendationsPanel = ({
  stats,
  recommendations = [],
  onAssign,
}: {
  stats: UserStats;
  recommendations?: PracticeRecommendation[];
  onAssign?: (recommendation: PracticeRecommendation) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [assignedTitles, setAssignedTitles] = useState<Set<string>>(new Set());
  const strongest = stats.strongestTopics[0];
  const focus = stats.focusTopics[0];
  const summary = stats.totalAttempted === 0
    ? "Practice activity will appear here once the student starts answering questions."
    : `The student has completed ${stats.totalAttempted} questions at ${stats.overallAccuracy}% accuracy. ${stats.weeklyTrendPct >= 0 ? "Accuracy is trending up" : "Accuracy dipped"} by ${Math.abs(stats.weeklyTrendPct)} percentage points this week.`;

  return (
    <div className="bg-primary/5 border border-primary/20 shadow-sm rounded-[2rem] p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between h-full">
      {/* Decorative gradient */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="h-4 w-4" /> AI Teacher Summary
        </div>
        
        <h3 className="text-xl font-bold mb-4">
          {focus ? `Priority focus: ${focus.topic}` : "Practice insights are ready when activity begins."}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          {summary}
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3 bg-background/50 rounded-xl p-4 border border-border/50">
            <div className="p-2 bg-success/10 rounded-lg shrink-0 mt-0.5">
              <BookOpen className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="font-semibold text-sm">Strongest Area: {strongest?.topic ?? "Not enough data yet"}</p>
              <p className="text-xs text-muted-foreground">
                {strongest ? `${strongest.accuracy}% accuracy across ${strongest.attempted} attempts.` : "Complete a few practice questions to reveal strengths."}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-background/50 rounded-xl p-4 border border-border/50">
            <div className="p-2 bg-orange-500/10 rounded-lg shrink-0 mt-0.5">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-sm">Priority Area: {focus?.topic ?? "Not enough data yet"}</p>
              <p className="text-xs text-muted-foreground">
                {focus ? `${focus.accuracy}% accuracy; assign targeted ${focus.subject} practice next.` : "Weaknesses appear after at least two attempts in a topic."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showOptions && (
        <div className="mb-4">
          <div className="mb-3">
            <p className="text-sm font-semibold">Choose practice to assign</p>
            <p className="text-xs text-muted-foreground">
              Topic gaps appear first, followed by every subject category so parents can recommend any area.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
          {recommendations.map((recommendation) => {
            const assigned = assignedTitles.has(recommendation.title);
            return (
              <div key={`${recommendation.title}-${recommendation.subject}`} className="rounded-xl border border-border bg-background/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-sm">{recommendation.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{recommendation.reason}</p>
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Year {recommendation.yearLevel} - {recommendation.subject} - {recommendation.examType}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={assigned ? "secondary" : "default"}
                    className="shrink-0 rounded-xl"
                    disabled={assigned}
                    onClick={() => {
                      onAssign?.(recommendation);
                      setAssignedTitles((current) => new Set(current).add(recommendation.title));
                    }}
                  >
                    {assigned ? <CheckCircle2 className="h-4 w-4" /> : null}
                    {assigned ? "Assigned" : "Assign"}
                  </Button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      <Button
        type="button"
        className="w-full sm:w-auto self-start rounded-xl group mt-auto shadow-sm"
        onClick={() => setShowOptions((value) => !value)}
      >
        {showOptions ? "Hide Practice Options" : "Assign Targeted Practice"}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};
