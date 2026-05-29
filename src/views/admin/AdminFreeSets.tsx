import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listQuestions,
  setQuestionFreeSample,
  type DbQuestion,
  type QuestionSubject,
} from "@/lib/questionsApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Search, Star } from "lucide-react";

const YEARS = ["3", "4", "5", "6", "7", "8", "9"] as const;
const SUBJECTS: { value: QuestionSubject | "all"; label: string }[] = [
  { value: "all", label: "All subjects" },
  { value: "maths", label: "Maths" },
  { value: "reading", label: "Reading" },
  { value: "writing", label: "Writing" },
  { value: "conventions", label: "Conventions" },
  { value: "reasoning", label: "Reasoning" },
];

export default function AdminFreeSets() {
  const [questions, setQuestions] = useState<DbQuestion[] | null>(null);
  const [year, setYear] = useState<string>("5");
  const [subject, setSubject] = useState<QuestionSubject | "all">("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setQuestions(null);
    try {
      const data = await listQuestions({
        status: "approved",
        yearLevel: Number(year),
        subject,
      });
      setQuestions(data);
    } catch (e) {
      toast({
        title: "Failed to load free set",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
      setQuestions([]);
    }
  }, [subject, toast, year]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!questions) return null;
    const needle = search.trim().toLowerCase();
    if (!needle) return questions;
    return questions.filter((q) =>
      q.content.toLowerCase().includes(needle) ||
      q.topic.toLowerCase().includes(needle) ||
      q.subtopic.toLowerCase().includes(needle)
    );
  }, [questions, search]);

  const selected = useMemo(
    () => (questions ?? []).filter((q) => q.is_free_sample),
    [questions]
  );

  const selectedBySubject = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of selected) counts[q.subject] = (counts[q.subject] ?? 0) + 1;
    return counts;
  }, [selected]);

  const onToggle = async (q: DbQuestion) => {
    setBusyId(q.id);
    try {
      const updated = await setQuestionFreeSample(q.id, !q.is_free_sample);
      setQuestions((prev) => prev?.map((item) => item.id === q.id ? updated : item) ?? null);
      toast({
        title: updated.is_free_sample ? "Added to free set" : "Removed from free set",
        description: `Year ${q.year_level} ${q.subject} free sample updated.`,
      });
    } catch (e) {
      toast({
        title: "Failed to update free set",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Free Question Sets</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Curate the approved questions that free users receive for each year level.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {selected.length} selected
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Selected for Year {year}</div>
          <div className="text-2xl font-bold mt-1">{selected.length}</div>
        </Card>
        {SUBJECTS.filter((s) => s.value !== "all").slice(0, 3).map((s) => (
          <Card key={s.value} className="p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{selectedBySubject[s.value] ?? 0}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => <SelectItem key={y} value={y}>Year {y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={subject} onValueChange={(v) => setSubject(v as QuestionSubject | "all")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="md:col-span-3 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search approved questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
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
            No approved questions match this free-set filter.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[340px]">Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Free set</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-xl">
                    <div className="line-clamp-2 text-sm">{q.content}</div>
                  </TableCell>
                  <TableCell className="capitalize text-sm">{q.subject}</TableCell>
                  <TableCell className="text-sm">{q.topic || "General"}</TableCell>
                  <TableCell className="text-sm">{q.difficulty}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={q.is_free_sample ? "secondary" : "ghost"}
                      size="sm"
                      disabled={busyId === q.id}
                      onClick={() => onToggle(q)}
                    >
                      <Star className={`h-4 w-4 ${q.is_free_sample ? "fill-amber-400 text-amber-400" : ""}`} />
                      {q.is_free_sample ? "Included" : "Include"}
                    </Button>
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
