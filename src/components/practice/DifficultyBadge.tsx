import { cn } from "@/lib/utils";

const levels = ["Easy", "Medium", "Challenging", "Hard", "Expert"] as const;
const colors = [
  "bg-success/10 text-success",
  "bg-primary/10 text-primary",
  "bg-[hsl(var(--subject-reasoning))]/10 text-[hsl(var(--subject-reasoning))]",
  "bg-accent/10 text-accent",
  "bg-destructive/10 text-destructive",
];

export function DifficultyBadge({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", colors[level - 1])}>
      {levels[level - 1]}
    </span>
  );
}
