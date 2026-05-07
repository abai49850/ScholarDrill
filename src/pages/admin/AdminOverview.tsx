import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, CheckCircle2, FileEdit, BookOpen } from "lucide-react";
import { getQuestionStats } from "@/lib/questionsApi";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const SUBJECT_LABEL: Record<string, string> = {
  maths: "Numeracy / Maths",
  reading: "Reading",
  writing: "Writing",
  conventions: "Conventions of Language",
  reasoning: "Thinking Skills",
};
const EXAM_LABEL: Record<string, string> = {
  naplan: "NAPLAN",
  selective: "Selective",
  scholarship: "Scholarship",
  general: "General",
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getQuestionStats>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQuestionStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-destructive">Error: {error}</p>;
  if (!stats) return <Skeleton className="h-64 w-full" />;

  const tiles = [
    { label: "Total Questions", value: stats.total, icon: Database, accent: "text-primary" },
    { label: "Approved (Live)", value: stats.approved, icon: CheckCircle2, accent: "text-green-600" },
    { label: "Drafts (Pending)", value: stats.draft, icon: FileEdit, accent: "text-amber-600" },
    { label: "Subjects", value: Object.keys(stats.bySubject).length, icon: BookOpen, accent: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Question Bank Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review, approve, and manage every practice question in the ScholarDrill library.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{t.label}</span>
                <t.icon className={`w-4 h-4 ${t.accent}`} />
              </div>
              <div className="text-2xl font-bold">{t.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BreakdownCard title="By Subject" data={stats.bySubject} labelMap={SUBJECT_LABEL} />
        <BreakdownCard title="By Year Level" data={stats.byYear} labelPrefix="Year " />
        <BreakdownCard title="By Exam Type" data={stats.byExam} labelMap={EXAM_LABEL} />
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  data,
  labelMap,
  labelPrefix = "",
}: {
  title: string;
  data: Record<string, number>;
  labelMap?: Record<string, string>;
  labelPrefix?: string;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-sm">
            <span>{labelMap?.[k] ?? `${labelPrefix}${k}`}</span>
            <Badge variant="secondary">{v}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
