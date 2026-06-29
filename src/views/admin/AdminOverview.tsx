import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, CheckCircle2, FileEdit, Layers3 } from "lucide-react";
import { getQuestionStats } from "@/lib/questionsApi";
import { examCards, examCategories, type ExamCard } from "@/data/examCatalog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const SUBJECT_LABEL: Record<string, string> = {
  maths: "Numeracy / Maths",
  reading: "Reading",
  writing: "Writing",
  conventions: "Conventions of Language",
  reasoning: "Thinking Skills",
  science: "Science",
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
    { label: "Exam Pathways", value: examCards.length, icon: Layers3, accent: "text-accent" },
  ];
  const pathwayCounts = examCategories
    .filter((c) => c.key !== "all")
    .reduce<Record<string, number>>((acc, c) => {
      acc[c.label] = examCards.filter((card) => card.category === c.key).length;
      return acc;
    }, {});

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Question Bank Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review, approve, and manage every practice question in the ScholarEdge library.
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configured Exam Pathways</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BreakdownRows data={pathwayCounts} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {examCards.map((card) => (
              <ExamPathwayRow
                key={card.id}
                card={card}
                matchingQuestions={getPathwayCoverage(card, stats.byExamSubject)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getPathwayCoverage(card: ExamCard, byExamSubject: Record<string, number>) {
  return card.subjects.reduce((sum, subject) => sum + (byExamSubject[`${card.dbExamType}:${subject}`] ?? 0), 0);
}

function ExamPathwayRow({
  card,
  matchingQuestions,
}: {
  card: ExamCard;
  matchingQuestions: number;
}) {
  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-sm">{card.title}</div>
          <div className="text-xs text-muted-foreground">
            {card.questionCountLabel} | {card.estimatedMinutes} min | Year {card.yearLevels[0]}-
            {card.yearLevels[card.yearLevels.length - 1]}
          </div>
        </div>
        <Badge variant={matchingQuestions > 0 ? "secondary" : "destructive"}>{matchingQuestions}</Badge>
      </div>
      <div className="flex flex-wrap gap-1">
        {card.subjects.map((subject) => (
          <Badge key={subject} variant="outline" className="text-[11px]">
            {SUBJECT_LABEL[subject] ?? subject}
          </Badge>
        ))}
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

function BreakdownRows({ data }: { data: Record<string, number> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {Object.entries(data).map(([label, count]) => (
        <div key={label} className="rounded-lg border border-border px-3 py-2">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold">{count}</div>
        </div>
      ))}
    </div>
  );
}
