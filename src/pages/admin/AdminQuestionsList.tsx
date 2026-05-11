import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  listQuestions,
  setQuestionStatus,
  setQuestionFreeSample,
  deleteQuestion,
  type DbQuestion,
  type QuestionExamType,
  type QuestionStatus,
  type QuestionSubject,
} from "@/lib/questionsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  FilePlus2,
  Pencil,
  PlayCircle,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SUBJECTS: { value: QuestionSubject | "all"; label: string }[] = [
  { value: "all", label: "All subjects" },
  { value: "maths", label: "Numeracy / Maths" },
  { value: "reading", label: "Reading" },
  { value: "writing", label: "Writing" },
  { value: "conventions", label: "Conventions" },
  { value: "reasoning", label: "Thinking Skills" },
];
const EXAMS: { value: QuestionExamType | "all"; label: string }[] = [
  { value: "all", label: "All exams" },
  { value: "naplan", label: "NAPLAN" },
  { value: "selective", label: "Selective" },
  { value: "scholarship", label: "Scholarship" },
  { value: "general", label: "General" },
];
const STATUSES: { value: QuestionStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
];
const YEARS = ["all", "3", "5", "7", "9"] as const;

export default function AdminQuestionsList() {
  const [items, setItems] = useState<DbQuestion[] | null>(null);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<QuestionSubject | "all">("all");
  const [examType, setExamType] = useState<QuestionExamType | "all">("all");
  const [status, setStatus] = useState<QuestionStatus | "all">("all");
  const [year, setYear] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const load = async () => {
    setItems(null);
    try {
      const data = await listQuestions({
        subject,
        examType,
        status,
        yearLevel: year === "all" ? "all" : Number(year),
        search: search.trim() || undefined,
      });
      setItems(data);
    } catch (e) {
      toast({ title: "Failed to load", description: (e as Error).message, variant: "destructive" });
      setItems([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, examType, status, year]);

  const filtered = useMemo(() => {
    if (!items) return null;
    if (!search.trim()) return items;
    const s = search.toLowerCase();
    return items.filter((q) => q.content.toLowerCase().includes(s));
  }, [items, search]);

  const onApprove = async (q: DbQuestion) => {
    setBusyId(q.id);
    try {
      const updated = await setQuestionStatus(q.id, "approved");
      setItems((prev) => prev?.map((p) => (p.id === q.id ? updated : p)) ?? null);
      toast({ title: "Approved", description: "Question is now live for students." });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const onUnapprove = async (q: DbQuestion) => {
    setBusyId(q.id);
    try {
      const updated = await setQuestionStatus(q.id, "draft");
      setItems((prev) => prev?.map((p) => (p.id === q.id ? updated : p)) ?? null);
      toast({ title: "Moved back to draft" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const onToggleFree = async (q: DbQuestion) => {
    setBusyId(q.id);
    try {
      const updated = await setQuestionFreeSample(q.id, !q.is_free_sample);
      setItems((prev) => prev?.map((p) => (p.id === q.id ? updated : p)) ?? null);
      toast({
        title: updated.is_free_sample
          ? "Added to free sample"
          : "Removed from free sample",
        description: `Year ${q.year_level} free-tier set updated.`,
      });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (q: DbQuestion) => {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    setBusyId(q.id);
    try {
      await deleteQuestion(q.id);
      setItems((prev) => prev?.filter((p) => p.id !== q.id) ?? null);
      toast({ title: "Deleted" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">All Questions</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {filtered ? `${filtered.length} question${filtered.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/questions/new">
            <FilePlus2 className="w-4 h-4 mr-1" /> Add question
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search question text…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={subject} onValueChange={(v) => setSubject(v as QuestionSubject | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={examType} onValueChange={(v) => setExamType(v as QuestionExamType | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {EXAMS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => <SelectItem key={y} value={y}>{y === "all" ? "All years" : `Year ${y}`}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v as QuestionStatus | "all")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        {!filtered ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No questions match these filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[300px]">Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Diff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-md">
                    <div className="line-clamp-2 text-sm">{q.content}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {q.topic}{q.subtopic ? ` · ${q.subtopic}` : ""}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-sm">{q.subject}</TableCell>
                  <TableCell className="text-sm">{q.year_level}</TableCell>
                  <TableCell className="capitalize text-sm">{q.exam_type}</TableCell>
                  <TableCell className="text-sm">{q.difficulty}</TableCell>
                  <TableCell>
                    {q.status === "approved" ? (
                      <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Test"
                        onClick={() => navigate(`/admin/questions/${q.id}/test`)}
                      >
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit"
                        onClick={() => navigate(`/admin/questions/${q.id}`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {q.status === "draft" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Approve"
                          disabled={busyId === q.id}
                          onClick={() => onApprove(q)}
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Move to draft"
                          disabled={busyId === q.id}
                          onClick={() => onUnapprove(q)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        disabled={busyId === q.id}
                        onClick={() => onDelete(q)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
