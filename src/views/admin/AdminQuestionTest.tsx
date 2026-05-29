import { useEffect, useState } from "react";
import { Link, useParams } from "@/lib/router";
import { getQuestion, setQuestionStatus, type DbQuestion } from "@/lib/questionsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Pencil, RotateCcw } from "lucide-react";
import { AnswerOption } from "@/components/practice/AnswerOption";
import { ExplanationPanel } from "@/components/practice/ExplanationPanel";
import { DifficultyBadge } from "@/components/practice/DifficultyBadge";
import { useToast } from "@/hooks/use-toast";

const LABELS = ["A", "B", "C", "D"];

export default function AdminQuestionTest() {
  const { id } = useParams();
  const { toast } = useToast();
  const [q, setQ] = useState<DbQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    getQuestion(id).then(setQ);
  }, [id]);

  if (!q) return <p className="text-muted-foreground">Loading…</p>;

  const isCorrect = selected === q.correct_option_id;

  const reset = () => {
    setSelected(null);
    setRevealed(false);
  };

  const toggleApprove = async () => {
    setBusy(true);
    try {
      const next = q.status === "approved" ? "draft" : "approved";
      const updated = await setQuestionStatus(q.id, next);
      setQ(updated);
      toast({ title: next === "approved" ? "Approved & live" : "Moved back to draft" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/questions"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
          </Button>
          <h2 className="text-xl font-bold">Test question</h2>
          <Badge variant={q.status === "approved" ? "default" : "secondary"}>{q.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/questions/${q.id}`}>
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Link>
          </Button>
          <Button size="sm" disabled={busy} onClick={toggleApprove}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            {q.status === "approved" ? "Unapprove" : "Approve"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <DifficultyBadge level={Math.min(5, Math.max(1, q.difficulty)) as 1 | 2 | 3 | 4 | 5} />
            <Badge variant="secondary" className="capitalize">{q.subject}</Badge>
            <Badge variant="secondary" className="capitalize">{q.exam_type}</Badge>
            <Badge variant="secondary">Year {q.year_level}</Badge>
            {q.topic && <Badge variant="outline">{q.topic}</Badge>}
            {q.subtopic && <Badge variant="outline">{q.subtopic}</Badge>}
          </div>

          <h3 className="text-lg font-semibold whitespace-pre-line leading-relaxed">{q.content}</h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <AnswerOption
                key={opt.id}
                id={opt.id}
                text={opt.text}
                label={LABELS[i]}
                isSelected={selected === opt.id}
                isCorrect={revealed ? opt.id === q.correct_option_id : null}
                isRevealed={revealed}
                onSelect={(o) => !revealed && setSelected(o)}
                disabled={revealed}
              />
            ))}
          </div>

          <ExplanationPanel
            explanation={q.explanation}
            isCorrect={isCorrect}
            visible={revealed}
          />

          <div className="flex justify-end">
            {!revealed ? (
              <Button disabled={!selected} onClick={() => setRevealed(true)}>
                Reveal answer
              </Button>
            ) : (
              <Button variant="outline" onClick={reset}>Try again</Button>
            )}
          </div>

          {q.skill_tags?.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <strong>Skill tags:</strong> {q.skill_tags.join(", ")}
            </div>
          )}
          {q.source_reference && (
            <div className="text-xs text-muted-foreground">
              <strong>Source:</strong> {q.source_reference}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
