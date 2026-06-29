import { useEffect, useMemo, useState } from "react";
import { Download, Share, Flame, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExamReadinessRing } from "./widgets/ExamReadinessRing";
import { StudyConsistencyHeatmap } from "./widgets/StudyConsistencyHeatmap";
import { PerformanceTrendsChart } from "./widgets/PerformanceTrendsChart";
import { AiRecommendationsPanel } from "./widgets/AiRecommendationsPanel";
import type { Profile } from "@/contexts/AuthContext";
import { buildPerformanceSummary, type UserStats } from "@/lib/statsApi";
import {
  addPracticeAssignment,
  loadPracticeAssignments,
  type PracticeAssignment,
  type PracticeRecommendation,
} from "@/lib/practiceAssignments";
import { buildPracticeRecommendations } from "@/lib/practiceRecommendations";
import { toast } from "sonner";

interface Props {
  stats: UserStats;
  profile: Profile | null;
  userId?: string | null;
}

function downloadHtmlReport(stats: UserStats, profile: Profile | null) {
  const name = profile?.display_name || "Student";
  const summary = buildPerformanceSummary(stats, profile?.daily_goal ?? 10);
  const subjectRows = stats.bySubject
    .map((s) => `<tr><td>${s.subject}</td><td>${s.attempted}</td><td>${s.correct}</td><td>${s.accuracy}%</td></tr>`)
    .join("");
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>ScholarEdge Report - ${name}</title>
<style>body{font-family:Arial,sans-serif;margin:32px;color:#172033;line-height:1.5}h1{color:#006eb8}table{border-collapse:collapse;width:100%;margin-top:16px}td,th{border:1px solid #d8dee9;padding:8px;text-align:left}.muted{color:#596579}</style></head>
<body><h1>ScholarEdge Performance Report</h1><p class="muted">${new Date().toLocaleDateString()}</p>
<h2>${name}</h2><p>${summary}</p>
<h3>Subject Performance</h3><table><thead><tr><th>Subject</th><th>Attempts</th><th>Correct</th><th>Accuracy</th></tr></thead><tbody>${subjectRows || "<tr><td colspan='4'>No practice activity yet.</td></tr>"}</tbody></table>
<h3>Strengths</h3><ul>${stats.strongestTopics.map((t) => `<li>${t.topic}: ${t.accuracy}% (${t.attempted} attempts)</li>`).join("") || "<li>No strengths identified yet.</li>"}</ul>
<h3>Focus Areas</h3><ul>${stats.focusTopics.map((t) => `<li>${t.topic}: ${t.accuracy}% (${t.attempted} attempts)</li>`).join("") || "<li>No focus areas identified yet.</li>"}</ul>
</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ScholarEdge-report-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

function shareWithTutor(stats: UserStats, profile: Profile | null) {
  const email = window.prompt("Enter tutor email address");
  if (!email) return;
  const name = profile?.display_name || "Student";
  const subject = encodeURIComponent(`ScholarEdge progress report for ${name}`);
  const body = encodeURIComponent([
    "Hello,",
    "",
    `Here is ${name}'s ScholarEdge progress summary:`,
    buildPerformanceSummary(stats, profile?.daily_goal ?? 10),
    "",
    "Strengths:",
    ...(stats.strongestTopics.length ? stats.strongestTopics.map((t) => `- ${t.topic}: ${t.accuracy}%`) : ["- Not enough data yet"]),
    "",
    "Focus areas:",
    ...(stats.focusTopics.length ? stats.focusTopics.map((t) => `- ${t.topic}: ${t.accuracy}%`) : ["- Not enough data yet"]),
  ].join("\n"));
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
}

const SUBJECT_LABELS: Record<string, string> = {
  maths: "Maths",
  reading: "Reading",
  writing: "Writing",
  conventions: "Conventions",
  reasoning: "Reasoning",
  science: "Science",
};

function SubjectPerformanceSnapshot({ stats }: { stats: UserStats }) {
  const rows = stats.bySubject
    .map((subject) => ({
      ...subject,
      label: SUBJECT_LABELS[subject.subject] ?? subject.subject,
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted);
  const maxAttempts = Math.max(1, ...rows.map((row) => row.attempted));

  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">Subject performance snapshot</h3>
          <p className="text-sm text-muted-foreground">
            Lower accuracy and fewer attempts are useful signals for what to assign next.
          </p>
        </div>
        <div className="text-sm font-semibold text-primary">{stats.overallAccuracy}% overall accuracy</div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
          No subject data yet. Ask the student to complete one practice set to unlock this chart.
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.subject} className="grid gap-2 md:grid-cols-[140px_1fr_92px] md:items-center">
              <div>
                <p className="text-sm font-semibold">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.attempted} attempts</p>
              </div>
              <div className="space-y-1">
                <div className="h-3 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, row.accuracy)}%` }} />
                </div>
                <div className="h-2 rounded-full bg-secondary/70">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: `${Math.max(4, Math.round((row.attempted / maxAttempts) * 100))}%` }}
                  />
                </div>
              </div>
              <div className="text-sm font-bold md:text-right">
                {row.accuracy}%
                <span className="block text-xs font-medium text-muted-foreground">accuracy</span>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-5 rounded-full bg-primary" /> Accuracy</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-5 rounded-full bg-success" /> Practice volume</span>
          </div>
        </div>
      )}
    </section>
  );
}

export const ParentPortal = ({ stats, profile, userId }: Props) => {
  const readiness = Math.min(100, Math.round((stats.overallAccuracy * 0.7) + (Math.min(stats.totalAttempted, 100) / 100) * 30));
  const trend = `${stats.weeklyTrendPct >= 0 ? "+" : ""}${stats.weeklyTrendPct}%`;
  const recommendations = useMemo(
    () => buildPracticeRecommendations(stats, profile?.year_level ?? 5),
    [profile?.year_level, stats]
  );
  const [assignments, setAssignments] = useState<PracticeAssignment[]>(() => loadPracticeAssignments(userId));

  useEffect(() => {
    setAssignments(loadPracticeAssignments(userId));
  }, [userId]);

  const assignPractice = (recommendation: PracticeRecommendation) => {
    if (!userId) return;
    const next = addPracticeAssignment(userId, recommendation);
    setAssignments(next);
    toast.success("Practice assigned to the student dashboard.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parent Portal</h2>
          <p className="text-muted-foreground">Comprehensive insights into student progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadHtmlReport(stats, profile)}
            className="gap-2 bg-background rounded-xl border-border/60 hover:bg-muted/50"
          >
            <Download className="h-4 w-4" /> Download Report
          </Button>
          <Button type="button" onClick={() => shareWithTutor(stats, profile)} className="gap-2 rounded-xl shadow-sm">
            <Share className="h-4 w-4" /> Share with Tutor
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-xl shadow-sm">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{stats.currentStreak}-day streak</p>
              <p className="text-xs text-muted-foreground">
                {stats.currentStreak > 0 ? "Consistent study is building momentum." : "No streak yet. One practice session starts it."}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-xl shadow-sm">
              <ClipboardCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{assignments.length} assigned practice set{assignments.length === 1 ? "" : "s"}</p>
              <p className="text-xs text-muted-foreground">
                Assigned sets appear on the student dashboard until marked complete.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SubjectPerformanceSnapshot stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ExamReadinessRing score={readiness} trend={trend} />
          <StudyConsistencyHeatmap activity={stats.monthlyActivity} dailyGoal={profile?.daily_goal ?? 10} />
        </div>

        <div className="lg:col-span-2">
          <PerformanceTrendsChart data={stats.performanceTrend} />
        </div>

        <div className="lg:col-span-3">
          <AiRecommendationsPanel stats={stats} recommendations={recommendations} onAssign={assignPractice} />
        </div>
      </div>
    </div>
  );
};
