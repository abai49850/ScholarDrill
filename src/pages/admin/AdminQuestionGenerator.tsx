import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { createQuestion, type QuestionDraft, type QuestionExamType, type QuestionSubject } from "@/lib/questionsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, CheckCircle2, Trash2, Save, RefreshCw, Wand2 } from "lucide-react";

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
];
const EXAMS: { value: QuestionExamType; label: string }[] = [
  { value: "naplan", label: "NAPLAN" },
  { value: "selective", label: "Selective" },
  { value: "scholarship", label: "Scholarship" },
  { value: "general", label: "General" },
];
const YEARS = [3, 4, 5, 6, 7, 8, 9] as const;

export default function AdminQuestionGenerator() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<QuestionSubject>("maths");
  const [examType, setExamType] = useState<QuestionExamType>("naplan");
  const [yearLevel, setYearLevel] = useState<number>(5);
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [skillTags, setSkillTags] = useState("");
  const [difficulty, setDifficulty] = useState<number>(3);
  const [count, setCount] = useState<number>(5);
  const [notes, setNotes] = useState("");

  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedQuestion[]>([]);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [savedIdx, setSavedIdx] = useState<Set<number>>(new Set());
  const [savingAll, setSavingAll] = useState(false);

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
          topic: topic.trim() || undefined,
          subtopic: subtopic.trim() || undefined,
          skillTags: skillTags.split(",").map((s) => s.trim()).filter(Boolean),
          difficulty,
          count,
          notes: notes.trim() || undefined,
        },
      });
      if (error) throw error;
      const errMsg = (data as { error?: string })?.error;
      if (errMsg) throw new Error(errMsg);
      const qs = (data as { questions: GeneratedQuestion[] }).questions ?? [];
      if (qs.length === 0) throw new Error("No questions returned");
      setResults(qs);
      toast({ title: "Generated", description: `${qs.length} draft questions ready for review.` });
    } catch (e) {
      toast({
        title: "Generation failed",
        description: e instanceof Error ? e.message : "Try again",
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
    topic: q.topic || topic || "General",
    subtopic: q.subtopic || subtopic || "",
    skill_tags: q.skillTags ?? [],
    source_reference: `AI-generated · Gemini · ${new Date().toISOString().slice(0, 10)}`,
    time_limit_seconds: q.timeLimitSeconds ?? 60,
    status,
  });

  const saveViaFn = async (drafts: QuestionDraft[]) => {
    const { data, error } = await supabase.functions.invoke("save-questions", {
      body: { questions: drafts },
    });
    if (error) throw error;
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
        title: status === "approved" ? "Approved & published" : "Saved as draft",
        description: "Question added to library.",
      });
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Try again",
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
      const ok = await saveViaFn(pending.map(({ q }) => buildDraft(q, status)));
      setSavedIdx((s) => {
        const next = new Set(s);
        pending.forEach(({ i }) => next.add(i));
        return next;
      });
      toast({ title: `Saved ${ok}`, description: `Bulk ${status === "approved" ? "publish" : "save"} complete.` });
    } catch (e) {
      toast({
        title: "Bulk save failed",
        description: e instanceof Error ? e.message : "Try again",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Question Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate fresh, curriculum-aligned questions on demand. Review, edit, then publish to the library.
          </p>
        </div>
      </div>

      <Card className="p-5 space-y-4">
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
            <Label>Exam type</Label>
            <Select value={examType} onValueChange={(v) => setExamType(v as QuestionExamType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXAMS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Topic (optional)</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Fractions" />
          </div>
          <div className="space-y-1.5">
            <Label>Subtopic (optional)</Label>
            <Input value={subtopic} onChange={(e) => setSubtopic(e.target.value)} placeholder="e.g. Equivalent fractions" />
          </div>
          <div className="space-y-1.5">
            <Label>Skill tags (comma-separated)</Label>
            <Input value={skillTags} onChange={(e) => setSkillTags(e.target.value)} placeholder="e.g. comparing, denominators" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Target difficulty (1–5)</Label>
            <Input type="number" min={1} max={5} value={difficulty}
              onChange={(e) => setDifficulty(Math.max(1, Math.min(5, Number(e.target.value) || 3)))} />
          </div>
          <div className="space-y-1.5">
            <Label>How many to generate</Label>
            <Input type="number" min={1} max={10} value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 5)))} />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <Label>Extra guidance (optional)</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. real-world contexts only" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={generate} disabled={generating} size="lg">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating…" : "Generate questions"}
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
                <CheckCircle2 className="w-4 h-4" /> Approve & publish all
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
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">#{i + 1}</Badge>
                    <Badge variant="outline">{q.topic}{q.subtopic ? ` · ${q.subtopic}` : ""}</Badge>
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
                    <Label>Skill tags (comma-separated)</Label>
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
                    Approve & publish
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
