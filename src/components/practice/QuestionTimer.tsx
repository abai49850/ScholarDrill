import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface QuestionTimerProps {
  totalSeconds: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

export function QuestionTimer({ totalSeconds, isRunning, onTimeUp }: QuestionTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const progress = remaining / totalSeconds;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = progress < 0.25;
  const circumference = 2 * Math.PI * 20;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="3"
          />
          <motion.circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke={isLow ? "hsl(var(--accent))" : "hsl(var(--primary))"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <Clock className={`absolute inset-0 m-auto w-4 h-4 ${isLow ? "text-accent" : "text-primary"}`} />
      </div>
      <span className={`font-semibold tabular-nums text-lg ${isLow ? "text-accent" : "text-foreground"}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
