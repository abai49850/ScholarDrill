import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  id: string;
  text: string;
  label: string;
  isSelected: boolean;
  isCorrect: boolean | null; // null = not revealed
  isRevealed: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export function AnswerOption({
  id, text, label, isSelected, isCorrect, isRevealed, onSelect, disabled,
}: AnswerOptionProps) {
  const getBorderColor = () => {
    if (!isRevealed) return isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40";
    if (isCorrect) return "border-success ring-2 ring-success/20";
    if (isSelected && !isCorrect) return "border-accent ring-2 ring-accent/20";
    return "border-border opacity-60";
  };

  const getBgColor = () => {
    if (!isRevealed) return isSelected ? "bg-primary/5" : "bg-card";
    if (isCorrect) return "bg-success/5";
    if (isSelected && !isCorrect) return "bg-accent/5";
    return "bg-card";
  };

  return (
    <motion.button
      layout
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      animate={isRevealed && isSelected && !isCorrect ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
      transition={{ duration: 0.4 }}
      onClick={() => !disabled && onSelect(id)}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left",
        getBorderColor(),
        getBgColor(),
        disabled && !isRevealed && "cursor-not-allowed opacity-50"
      )}
    >
      <span className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
        isRevealed && isCorrect
          ? "bg-success border-success text-success-foreground"
          : isRevealed && isSelected && !isCorrect
          ? "bg-accent border-accent text-accent-foreground"
          : isSelected
          ? "bg-primary border-primary text-primary-foreground"
          : "border-border text-muted-foreground"
      )}>
        {isRevealed && isCorrect ? <Check className="w-4 h-4" /> :
         isRevealed && isSelected && !isCorrect ? <X className="w-4 h-4" /> :
         label}
      </span>
      <span className="text-base font-medium">{text}</span>
    </motion.button>
  );
}
