import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "@/lib/router";
import { z } from "zod";
import {
  createQuestion,
  getQuestion,
  setQuestionStatus,
  updateQuestion,
  type DbQuestion,
  type QuestionDraft,
  type QuestionExamType,
  type QuestionStatus,
  type QuestionSubject,
} from "@/lib/questionsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, PlayCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1, "Option text required").max(500),
});

const draftSchema = z.object({
  content: z.string().trim().min(5, "Question text is too short").max(4000),
  options: z.array(optionSchema).length(4, "Exactly 4 options required"),
  correct_option_id: z.string().min(1),
  explanation: z.string().trim().max(4000),
  difficulty: z.number().int().min(1).max(5),
  subject: z.enum(["maths", "reading", "writing", "conventions", "reasoning"]),
  exam_type: z.enum(["naplan", "selective", "scholarship", "general"]),
  year_level: z.number().int().min(1).max(12),
  topic: z.string().trim().max(100),
  subtopic: z.string().trim().max(100),
  skill_tags: z.array(z.string().trim().min(1).max(60)),
  source_reference: z.string().trim().max(200),
  time_limit_seconds: z.number().int().min(10).max(900),
  status: z.enum(["draft", "approved"]),
});

const empty: QuestionDraft = {
  content: "",
  options: [
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" },
  ],
  correct_option_id: "a",
  explanation: "",
  difficulty: 3,
  subject: "maths",
  exam_type: "naplan",
  year_level: 5,
  topic: "",
  subtopic: "",
  skill_tags: [],
  source_reference: "",
  time_limit_seconds: 60,
  status: "draft",
};

export default function AdminQuestionForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [draft, setDraft] = useState<QuestionDraft>(empty);
  const [loaded, setLoaded] = useState(isNew);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    getQuestion(id!).then((q) => {
      if (!q) {
        toast({ title: "Not found", variant: "destructive" });
        navigate("/admin/questions");
        return;
      }
      const { id: _i, legacy_id: _l, created_at: _c, updated_at: _u, approved_at: _a, ...rest } = q;
      setDraft(rest as QuestionDraft);
      setTagsInput((q.skill_tags ?? []).join(", "));
      setSavedId(q.id);
      setLoaded(true);
    }).catch((e) => toast({ title: "Failed", description: e.message, variant: "destructive" }));
  }, [id, isNew, navigate, toast]);

  const update = (patch: Partial<QuestionDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = async (approve = false) => {
    setErrors({});
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const candidate: QuestionDraft = {
      ...draft,
      skill_tags: tags,
      status: approve ? "approved" : draft.status,
    };
    const parsed = draftSchema.safeParse(candidate);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path.join(".")] = i.message;
      });
      setErrors(errs);
      toast({ title: "Please fix the highlighted fields", variant: "destructive" });
      return;
    }
    if (!candidate.options.find((o) => o.id === candidate.correct_option_id)) {
      setErrors({ correct_option_id: "Pick which option is correct" });
      return;
    }
    setSaving(true);
    try {
      let saved: DbQuestion;
      if (isNew) {
        saved = await createQuestion(candidate);
      } else {
        saved = await updateQuestion(id!, candidate);
        if (approve && saved.status !== "approved") {
          saved = await setQuestionStatus(saved.id, "approved");
        }
      }
      setSavedId(saved.id);
      toast({
        title: approve ? "Approved & published" : "Saved as draft",
        description: approve ? "Now available to students." : "Not visible to students yet.",
      });
      if (isNew) navigate(`/admin/questions/${saved.id}`, { replace: true });
    } catch (e) {
      toast({ title: "Failed to save", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <p className="text-muted-foreground">Loading…</p>;

  const err = (k: string) => errors[k] && <p className="text-xs text-destructive mt-1">{errors[k]}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/questions"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
          </Button>
          <h2 className="text-2xl font-bold">{isNew ? "Add question" : "Edit question"}</h2>
          {!isNew && (
            <Badge variant={draft.status === "approved" ? "default" : "secondary"}>
              {draft.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedId && (
            <Button asChild variant="outline">
              <Link to={`/admin/questions/${savedId}/test`}>
                <PlayCircle className="w-4 h-4 mr-1" /> Test
              </Link>
            </Button>
          )}
          <Button variant="outline" disabled={saving} onClick={() => handleSave(false)}>
            <Save className="w-4 h-4 mr-1" /> Save draft
          </Button>
          <Button disabled={saving} onClick={() => handleSave(true)}>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Save & approve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Question</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Question text</Label>
              <Textarea
                rows={5}
                value={draft.content}
                onChange={(e) => update({ content: e.target.value })}
                placeholder="Type the question, including any reading passage…"
              />
              {err("content")}
            </div>

            <div className="space-y-3">
              <Label>Options (pick the correct one)</Label>
              {draft.options.map((opt, idx) => (
                <div key={opt.id} className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => update({ correct_option_id: opt.id })}
                    className={`mt-2 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                      draft.correct_option_id === opt.id
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-border hover:border-foreground/40"
                    }`}
                    aria-label={`Mark option ${opt.id.toUpperCase()} as correct`}
                  >
                    {opt.id.toUpperCase()}
                  </button>
                  <Textarea
                    rows={2}
                    value={opt.text}
                    onChange={(e) => {
                      const next = [...draft.options];
                      next[idx] = { ...opt, text: e.target.value };
                      update({ options: next });
                    }}
                    placeholder={`Option ${opt.id.toUpperCase()}`}
                  />
                </div>
              ))}
              {err("correct_option_id")}
              {err("options")}
            </div>

            <div>
              <Label>Explanation</Label>
              <Textarea
                rows={4}
                value={draft.explanation}
                onChange={(e) => update({ explanation: e.target.value })}
                placeholder="Explain why the correct answer is right and why common distractors are wrong."
              />
              {err("explanation")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Classification</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Select value={draft.subject} onValueChange={(v) => update({ subject: v as QuestionSubject })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maths">Numeracy / Maths</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="conventions">Conventions of Language</SelectItem>
                  <SelectItem value="reasoning">Thinking Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Exam type</Label>
              <Select value={draft.exam_type} onValueChange={(v) => update({ exam_type: v as QuestionExamType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="naplan">NAPLAN</SelectItem>
                  <SelectItem value="selective">Selective</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Year level</Label>
                <Select value={String(draft.year_level)} onValueChange={(v) => update({ year_level: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[3, 5, 7, 9].map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Difficulty (1–5)</Label>
                <Select value={String(draft.difficulty)} onValueChange={(v) => update({ difficulty: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Topic</Label>
              <Input value={draft.topic} onChange={(e) => update({ topic: e.target.value })} placeholder="e.g. Number & Algebra" />
            </div>
            <div>
              <Label>Sub-topic</Label>
              <Input value={draft.subtopic} onChange={(e) => update({ subtopic: e.target.value })} placeholder="e.g. Fractions" />
            </div>
            <div>
              <Label>Skill tags (comma-separated)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="equivalent fractions, number sense"
              />
            </div>
            <div>
              <Label>Source / reference</Label>
              <Input
                value={draft.source_reference}
                onChange={(e) => update({ source_reference: e.target.value })}
                placeholder="e.g. Inspired by NAPLAN 2014 Y5"
              />
            </div>
            <div>
              <Label>Time limit (seconds)</Label>
              <Input
                type="number"
                min={10}
                max={900}
                value={draft.time_limit_seconds}
                onChange={(e) => update({ time_limit_seconds: Number(e.target.value) || 60 })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
