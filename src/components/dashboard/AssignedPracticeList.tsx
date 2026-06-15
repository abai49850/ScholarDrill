import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import {
  assignmentPracticeUrl,
  loadPracticeAssignments,
  removePracticeAssignment,
  type PracticeAssignment,
} from "@/lib/practiceAssignments";

export function AssignedPracticeList({ userId }: { userId?: string | null }) {
  const [assignments, setAssignments] = useState<PracticeAssignment[]>([]);

  useEffect(() => {
    setAssignments(loadPracticeAssignments(userId));
  }, [userId]);

  const markDone = (assignmentId: string) => {
    if (!userId) return;
    setAssignments(removePracticeAssignment(userId, assignmentId));
  };

  if (!assignments.length) return null;

  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <ClipboardList className="h-3.5 w-3.5" />
            Parent recommended
          </div>
          <h2 className="text-lg font-semibold">Assigned practice</h2>
          <p className="text-sm text-muted-foreground">Start with these targeted sets before choosing another test.</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Year {assignment.yearLevel} - {assignment.subject} - {assignment.examType}
                </p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => markDone(assignment.id)} title="Mark complete">
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{assignment.reason}</p>
            <Button asChild size="sm" className="mt-4 rounded-xl">
              <Link to={assignmentPracticeUrl(assignment)}>
                <PlayCircle className="h-4 w-4" /> Start assigned practice
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
