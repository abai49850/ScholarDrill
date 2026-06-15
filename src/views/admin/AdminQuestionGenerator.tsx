import { useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { examCards } from "@/data/examCatalog";
import { type QuestionDraft, type QuestionExamType, type QuestionSubject } from "@/lib/questionsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, CheckCircle2, Trash2, Save, RefreshCw, Wand2, ExternalLink } from "lucide-react";

interface GeneratedOption { id: string; text: string; }
interface GeneratedQuestion {
  content: string;
  options: GeneratedOption[];
  correctOptionId: string;
  explanation: string;
  topic: string;
  subtopic?: string;
  skillTags: string[];
  difficulty: number;
  timeLimitSeconds: number;
}

const SUBJECTS: { value: QuestionSubject; label: string }[] = [
  { value: "maths", label: "Numeracy / Maths" },
  { value: "reading", label: "Reading" },
  { value: "writing", label: "Writing" },
  { value: "conventions", label: "Conventions" },
  { value: "reasoning", label: "Thinking Skills" },
  { value: "science", label: "Science" },
];
const EXAMS: { value: QuestionExamType; label: string }[] = [
  { value: "naplan", label: "NAPLAN" },
  { value: "selective", label: "Selective" },
  { value: "scholarship", label: "Scholarship" },
  { value: "general", label: "General / ICAS / Senior" },
];
const YEARS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

async function getFunctionErrorMessage(error: unknown, fallback = "Try again") {
  const maybeError = error as { message?: string; context?: Response };
  if (maybeError?.context instanceof Response) {
    try {
      const body = await maybeError.context.clone().json() as { error?: string; message?: string };
      return body.error || body.message || maybeError.message || fallback;
    } catch {
      try {
        const text = await maybeError.context.clone().text();
        return text || maybeError.message || fallback;
      } catch {
        return maybeError.message || fallback;
      }
    }
  }
  return error instanceof Error ? error.message : fallback;
}

function examGuidance(card: (typeof examCards)[number]) {
  return [
    `${card.title}: ${card.description}`,
    `Mapped database exam type: ${card.dbExamType}`,
    `Years: ${card.yearLevels.join(", ")}`,
    `Expected structure: ${card.sections.map((s) => `${s.name} - ${s.questionLabel}, ${s.minutes} min, ${s.focus}`).join("; ")}`,
    `Use ${card.sourceLabel} only as format guidance. Do not copy official or third-party questions.`,
  ].join("\n");
}

export default function AdminQuestionGenerator() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [examPathwayId, setExamPathwayId] = useState<string>(examCards[0]?.id ?? "");
  const selectedExam = useMemo(
    () => examCards.find((card) => card.id === examPathwayId) ?? examCards[0],
    [examPathwayId],
  );

  const [subject, setSubject] = useState<QuestionSubject>(selectedExam?.subjects[0] ?? "maths");
  const [examType, setExamType] = useState<QuestionExamType>(selectedExam?.dbExamType ?? "naplan");
  const [yearLevel, setYearLevel] = useState<number>(selectedExam?.yearLevels[0] ?? 5);
  const [topic, setTopic] = useState(selectedExam?.title ?? "");
  const [subtopic, setSubtopic] = useState("");
  const [skillTags, setSkillTags] = useState("");
  const [difficulty, setDifficulty] = useState<number>(selectedExam?.difficulty ?? 3);
  const [count, setCount] = useState<number>(5);
  const [notes, setNotes] = useState("");

  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedQuestion[]>([]);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [savedIdx, setSavedIdx] = useState<Set<number>>(new Set());
  const [savingAll, setSavingAll] = useState(false);

  const applyPathway = (id: string) => {
    const card = examCards.find((c) => c.id === id);
    if (!card) return;
    setExamPathwayId(id);
    setExamType(card.dbExamType);
    setSubject(card.subjects[0]);
    setYearLevel(card.yearLevels.includes(yearLevel) ? yearLevel : card.yearLevels[0]);
    setDifficulty(card.difficulty);
    setTopic(card.title);
    setSubtopic(card.sections[0]?.name ?? "");
    setNotes("");
  };

  const generate = async () => {
    setGenerating(true);
    setResults([]);
    setSavedIdx(new Set());
    try {
      const { data, error } = await supabase.functions.invoke("generate-questions", {
        body: {
          subject,
          examType,
          yearLevel,
          topic: topic.trim() || selectedExam.title,
          subtopic: subtopic.trim() || undefined,
          skillTags: skillTags.split(",").map((s) => s.trim()).filter(Boolean),
          difficulty,
          count,
          notes: [examGuidance(selectedExam), notes.trim()].filter(Boolean).join("\n\n"),
          examPathway: {
            id: selectedExam.id,
            title: selectedExam.title,
            category: selectedExam.category,
            sourceLabel: selectedExam.sourceLabel,
            sourceUrl: selectedExam.sourceUrl,
            sections: selectedExam.sections,
          },
        },
      });
      if (error) throw new Error(await getFunctionErrorMessage(error));
      const errMsg = (data as { error?: string })?.error;
      if (errMsg) throw new Error(errMsg);
      const qs = (data as { questions: GeneratedQuestion[] }).questions ?? [];
      if (qs.length === 0) throw new Error("No questions returned");
      setResults(qs);
      toast({ title: "Generated", description: `${qs.length} draft questions ready for review.` });
    } catch (e) {
      const message = await getFunctionErrorMessage(e);
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const buildDraft = (q: GeneratedQuestion, status: "draft" | "approved" = "draft"): QuestionDraft => ({
    content: q.content,
    options: q.options,
    correct_option_id: q.correctOptionId,
    explanation: q.explanation,
    difficulty: Math.max(1, Math.min(5, q.difficulty ?? difficulty)),
    subject,
    exam_type: examType,
    year_level: yearLevel,
    topic: q.topic || topic || selectedExam.title,
    subtopic: q.subtopic || subtopic || "",
    skill_tags: q.skillTags ?? [],
    source_reference: `${selectedExam.title} | AI-generated Gemini | ${new Date().toISOString().slice(0, 10)}`,
    time_limit_seconds: q.timeLimitSeconds ?? ((selectedExam.sections.find((s) => s.subject === subject)?.minutes ?? 1) * 60),
    status,
  });

  const saveViaFn = async (drafts: QuestionDraft[]) => {
    const { data, error } = await supabase.functions.invoke("save-questions", {
      body: { questions: drafts },
    });
    if (error) throw new Error(await getFunctionErrorMessage(error));
    const errMsg = (data as { error?: string })?.error;
    if (errMsg) throw new Error(errMsg);
    return (data as { inserted: number }).inserted ?? 0;
  };

  const saveOne = async (i: number, status: "draft" | "approved") => {
    setSavingIdx(i);
    try {
      await saveViaFn([buildDraft(results[i], status)]);
      setSavedIdx((s) => new Set(s).add(i));
      toast({
        title: status === "approved" ? "Approved and published" : "Saved as draft",
        description: "Question added to library.",
      });
    } catch (e) {
      const message = await getFunctionErrorMessage(e);
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSavingIdx(null);
    }
  };

  const saveAll = async (status: "draft" | "approved") => {
    setSavingAll(true);
    const pending = results
      .map((q, i) => ({ q, i }))
      .filter(({ i }) => !savedIdx.has(i));
    try {
      let ok = 0;
      try {
        ok = await saveViaFn(pending.map(({ q }) => buildDraft(q, status)));
      } catch (bulkError) {
        const bulkMessage = await getFunctionErrorMessage(bulkError);
        if (pending.length <= 1) throw new Error(bulkMessage);

        const savedIndexes: number[] = [];
        const failures: string[] = [];
        for (const { q, i } of pending) {
          try {
            await saveViaFn([buildDraft(q, status)]);
            savedIndexes.push(i);
            ok += 1;
          } catch (rowError) {
            failures.push(`#${i + 1}: ${await getFunctionErrorMessage(rowError)}`);
          }
        }

        if (savedIndexes.length) {
          setSavedIdx((s) => {
            const next = new Set(s);
            savedIndexes.forEach((i) => next.add(i));
            return next;
          });
        }
        if (failures.length) {
          throw new Error(`Bulk save failed. ${failures.slice(0, 3).join(" | ")}${failures.length > 3 ? " ..." : ""}`);
        }
      }
      setSavedIdx((s) => {
        const next = new Set(s);
        pending.forEach(({ i }) => next.add(i));
        return next;
      });
      toast({ title: `Saved ${ok}`, description: `Bulk ${status === "approved" ? "publish" : "save"} complete.` });
    } catch (e) {
      const message = await getFunctionErrorMessage(e);
      toast({
        title: "Bulk save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSavingAll(false);
    }
  };

  const updateField = (i: number, patch: Partial<GeneratedQuestion>) => {
    setResults((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  };

  const updateOption = (i: number, oid: string, text: string) => {
    setResults((prev) =>
      prev.map((q, idx) =>
        idx === i ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, text } : o)) } : q,
      ),
    );
  };

  const removeQuestion = (i: number) => {
    setResults((prev) => prev.filter((_, idx) => idx !== i));
    setSavedIdx((s) => {
      const next = new Set<number>();
      s.forEach((v) => { if (v < i) next.add(v); else if (v > i) next.add(v - 1); });
      return next;
    });
  };

  const selectedSection = selectedExam.sections.find((s) => s.subject === subject) ?? selectedExam.sections[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Question Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate original questions for NAPLAN, ICAS, selective entry, ACER, EduTest, HSC and VCE pathways.
          </p>
        </div>
      </div>

      <Card className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Exam pathway</Label>
            <Select value={examPathwayId} onValueChange={applyPathway}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {examCards.map((card) => (
                  <SelectItem key={card.id} value={card.id}>{card.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Mapped database exam type</Label>
            <Select value={examType} onValueChange={(v) => setExamType(v as QuestionExamType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXAMS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{selectedExam.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedExam.description}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={selectedExam.sourceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" /> Source
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{selectedExam.questionCountLabel}</Badge>
            <Badge variant="outline">{selectedExam.estimatedMinutes} min</Badge>
            <Badge variant="outline">Years {selectedExam.yearLevels.join(", ")}</Badge>
            <Badge variant="outline">{selectedExam.sourceLabel}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {selectedExam.sections.map((section) => (
              <div key={`${section.name}-${section.subject}`} className="rounded-md border border-border bg-background p-3 text-sm">
                <div className="font-medium">{section.name}</div>
                <div className="text-xs text-muted-foreground">
                  {section.questionLabel} | {section.minutes} min | {section.focus}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={subject} onValueChange={(v) => setSubject(v as QuestionSubject)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Year level</Label>
            <Select value={String(yearLevel)} onValueChange={(v) => setYearLevel(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Exam section</Label>
            <Input
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
              placeholder={selectedSection?.name ?? "Section"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Topic</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Fractions" />
          </div>
          <div className="space-y-1.5">
            <Label>Subtopic</Label>
            <Input value={subtopic} onChange={(e) => setSubtopic(e.target.value)} placeholder="e.g. Equivalent fractions" />
          </div>
          <div className="space-y-1.5">
            <Label>Skill tags</Label>
            <Input value={skillTags} onChange={(e) => setSkillTags(e.target.value)} placeholder="e.g. comparing, inference" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Target difficulty (1-5)</Label>
            <Input type="number" min={1} max={5} value={difficulty}
              onChange={(e) => setDifficulty(Math.max(1, Math.min(5, Number(e.target.value) || 3)))} />
          </div>
          <div className="space-y-1.5">
            <Label>How many to generate</Label>
            <Input type="number" min={1} max={10} value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 5)))} />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <Label>Extra guidance</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. include data interpretation" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={generate} disabled={generating} size="lg">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating..." : "Generate questions"}
          </Button>
          {results.length > 0 && (
            <>
              <Button variant="outline" onClick={generate} disabled={generating}>
                <RefreshCw className="w-4 h-4" /> Regenerate
              </Button>
              <Button variant="secondary" onClick={() => saveAll("draft")} disabled={savingAll || generating}>
                <Save className="w-4 h-4" /> Save all as drafts
              </Button>
              <Button onClick={() => saveAll("approved")} disabled={savingAll || generating}>
                <CheckCircle2 className="w-4 h-4" /> Approve and publish all
              </Button>
            </>
          )}
        </div>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Review ({results.length})</h2>
            <p className="text-xs text-muted-foreground">Edit any field before saving. Saved items are marked.</p>
          </div>

          {results.map((q, i) => {
            const saved = savedIdx.has(i);
            return (
              <Card key={i} className={`p-5 space-y-3 ${saved ? "opacity-70 border-accent/40" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">#{i + 1}</Badge>
                    <Badge variant="outline">{selectedExam.title}</Badge>
                    <Badge variant="outline">{q.topic}{q.subtopic ? ` | ${q.subtopic}` : ""}</Badge>
                    <Badge variant="outline">Difficulty {q.difficulty}</Badge>
                    <Badge variant="outline">{q.timeLimitSeconds}s</Badge>
                    {saved && <Badge className="bg-accent text-accent-foreground"><CheckCircle2 className="w-3 h-3 mr-1" />Saved</Badge>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label>Question</Label>
                  <Textarea rows={3} value={q.content} onChange={(e) => updateField(i, { content: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((o) => (
                    <div key={o.id} className={`p-3 rounded-xl border ${o.id === q.correctOptionId ? "border-accent bg-accent/5" : "border-border"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={o.id === q.correctOptionId ? "default" : "outline"}>{o.id.toUpperCase()}</Badge>
                        <Button
                          type="button"
                          variant={o.id === q.correctOptionId ? "default" : "ghost"}
                          size="sm"
                          onClick={() => updateField(i, { correctOptionId: o.id })}
                        >
                          {o.id === q.correctOptionId ? "Correct" : "Mark correct"}
                        </Button>
                      </div>
                      <Input value={o.text} onChange={(e) => updateOption(i, o.id, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <Label>Explanation</Label>
                  <Textarea rows={3} value={q.explanation} onChange={(e) => updateField(i, { explanation: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Topic</Label>
                    <Input value={q.topic} onChange={(e) => updateField(i, { topic: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subtopic</Label>
                    <Input value={q.subtopic ?? ""} onChange={(e) => updateField(i, { subtopic: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Skill tags</Label>
                    <Input
                      value={q.skillTags.join(", ")}
                      onChange={(e) => updateField(i, { skillTags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant="outline" disabled={saved || savingIdx === i} onClick={() => saveOne(i, "draft")}>
                    {savingIdx === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save as draft
                  </Button>
                  <Button disabled={saved || savingIdx === i} onClick={() => saveOne(i, "approved")}>
                    {savingIdx === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Approve and publish
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      navigate("/admin/questions/new", {
                        state: { prefill: buildDraft(q, "draft") },
                      })
                    }
                  >
                    Open in full editor
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
