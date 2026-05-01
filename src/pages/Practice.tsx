import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Zap, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionTimer } from "@/components/practice/QuestionTimer";
import { AnswerOption } from "@/components/practice/AnswerOption";
import { ExplanationPanel } from "@/components/practice/ExplanationPanel";
import { DifficultyBadge } from "@/components/practice/DifficultyBadge";
import { SessionSummary } from "@/components/practice/SessionSummary";
import {
  sampleQuestions,
  selectQuestion,
  getNextDifficulty,
  type Question,
} from "@/data/sampleQuestions";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { listApprovedQuestions, dbToPracticeQuestion, type QuestionSubject } from "@/lib/questionsApi";
import { recordAttempt } from "@/lib/statsApi";

const TOTAL_QUESTIONS = 10;
const LABELS = ["A", "B", "C", "D"];

interface SessionResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

export default function Practice() {
  const [searchParams] = useSearchParams();
  const subjectFilter = searchParams.get("subject");
  const yearParam = searchParams.get("year");
  const { profile } = useUserProfile();
  const targetYear = yearParam ? Number(yearParam) : profile.yearLevel;

  const [pool, setPool] = useState<Question[] | null>(null);

  // Load approved questions from DB; fall back to bundled sample data if DB is empty/unreachable.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dbQs = await listApprovedQuestions(
          subjectFilter ? { subject: subjectFilter as QuestionSubject } : {}
        );
        if (cancelled) return;
        if (dbQs.length > 0) {
          setPool(dbQs.map(dbToPracticeQuestion));
          return;
        }
      } catch {
        /* fall back to sample */
      }
      if (cancelled) return;
      setPool(
        subjectFilter
          ? sampleQuestions.filter((q) => q.subject === subjectFilter)
          : sampleQuestions
      );
    })();
    return () => { cancelled = true; };
  }, [subjectFilter]);

  const filteredQuestions = useMemo(() => {
    if (!pool) return [];
    // Try exact year first, then ±1, then ±2, then fallback to whole pool
    const tiers = [0, 1, 2];
    for (const tier of tiers) {
      const matched = pool.filter((q) => Math.abs(q.yearLevel - targetYear) <= tier);
      if (matched.length >= TOTAL_QUESTIONS) return matched;
    }
    return pool;
  }, [pool, targetYear]);


  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [difficulty, setDifficulty] = useState(2);
  const [streak, setStreak] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [sessionDone, setSessionDone] = useState(false);
  const questionStartTime = useRef(Date.now());
  const totalSessionTime = useRef(0);

  const pickNextQuestion = useCallback(
    (diff: number, answered: Set<string>) => {
      const q = selectQuestion(filteredQuestions, diff, answered);
      if (!q) {
        setSessionDone(true);
        return;
      }
      setCurrentQuestion(q);
      setSelectedId(null);
      setRevealed(false);
      setTimerRunning(true);
      questionStartTime.current = Date.now();
    },
    [filteredQuestions]
  );

  // Pick first question once the pool has loaded
  useEffect(() => {
    if (!currentQuestion && filteredQuestions.length > 0) {
      pickNextQuestion(difficulty, answeredIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredQuestions]);

  const handleSelect = (optionId: string) => {
    if (revealed) return;
    setSelectedId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedId || !currentQuestion) return;
    setRevealed(true);
    setTimerRunning(false);

    const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);
    const correct = selectedId === currentQuestion.correctOptionId;
    const newResults = [...results, { questionId: currentQuestion.id, correct, timeSpent }];
    totalSessionTime.current += timeSpent;
    setResults(newResults);
    setStreak(correct ? streak + 1 : 0);
    setAnsweredIds((prev) => new Set([...prev, currentQuestion.id]));

    const recentCorrects = newResults.map((r) => r.correct);
    setDifficulty(getNextDifficulty(recentCorrects, difficulty));

    // Persist
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentQuestion.id);
    void recordAttempt({
      questionId: isUuid ? currentQuestion.id : null,
      legacyQuestionId: isUuid ? null : currentQuestion.id,
      subject: currentQuestion.subject,
      yearLevel: currentQuestion.yearLevel,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      selectedOptionId: selectedId,
      correctOptionId: currentQuestion.correctOptionId,
      isCorrect: correct,
      timeSpentSeconds: timeSpent,
    });
  };

  const handleTimeUp = () => {
    if (revealed) return;
    setRevealed(true);
    setTimerRunning(false);
    const timeSpent = currentQuestion?.timeLimitSeconds || 0;
    totalSessionTime.current += timeSpent;
    const newResults = [
      ...results,
      { questionId: currentQuestion!.id, correct: false, timeSpent },
    ];
    setResults(newResults);
    setStreak(0);
    setAnsweredIds((prev) => new Set([...prev, currentQuestion!.id]));
    const recentCorrects = newResults.map((r) => r.correct);
    setDifficulty(getNextDifficulty(recentCorrects, difficulty));

    const q = currentQuestion!;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q.id);
    void recordAttempt({
      questionId: isUuid ? q.id : null,
      legacyQuestionId: isUuid ? null : q.id,
      subject: q.subject,
      yearLevel: q.yearLevel,
      topic: q.topic,
      difficulty: q.difficulty,
      selectedOptionId: null,
      correctOptionId: q.correctOptionId,
      isCorrect: false,
      timeSpentSeconds: timeSpent,
    });
  };

  const handleNext = () => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setSessionDone(true);
      return;
    }
    setQuestionIndex((i) => i + 1);
    pickNextQuestion(difficulty, answeredIds);
  };

  const handleRestart = () => {
    setResults([]);
    setQuestionIndex(0);
    setDifficulty(2);
    setStreak(0);
    setAnsweredIds(new Set());
    setSessionDone(false);
    totalSessionTime.current = 0;
    pickNextQuestion(2, new Set());
  };

  const questionsTotal = Math.min(TOTAL_QUESTIONS, filteredQuestions.length);

  if (sessionDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <SessionSummary
          results={results}
          totalTime={totalSessionTime.current}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading questions…
        </div>
      </div>
    );
  }

  const isCorrect = selectedId === currentQuestion.correctOptionId;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass-nav">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Exit</Link>
          </Button>

          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <motion.div
                key={streak}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-accent font-bold text-sm"
              >
                <Zap className="w-4 h-4" /> {streak} streak
              </motion.div>
            )}
            <QuestionTimer
              key={currentQuestion.id}
              totalSeconds={currentQuestion.timeLimitSeconds}
              isRunning={timerRunning}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Question {questionIndex + 1} of {questionsTotal}</span>
          <span>{results.filter((r) => r.correct).length} correct</span>
        </div>
        <Progress value={((questionIndex + 1) / questionsTotal) * 100} className="h-2" />
      </div>

      {/* Question */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Meta */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <DifficultyBadge level={currentQuestion.difficulty} />
              <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {currentQuestion.topic}
              </span>
              <span className="text-xs text-muted-foreground">
                Year {currentQuestion.yearLevel}
              </span>
            </div>

            {/* Question text */}
            <h2 className="text-xl font-bold mb-8 leading-relaxed whitespace-pre-line">
              {currentQuestion.content}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt, i) => (
                <AnswerOption
                  key={opt.id}
                  id={opt.id}
                  text={opt.text}
                  label={LABELS[i]}
                  isSelected={selectedId === opt.id}
                  isCorrect={
                    revealed ? opt.id === currentQuestion.correctOptionId : null
                  }
                  isRevealed={revealed}
                  onSelect={handleSelect}
                  disabled={revealed}
                />
              ))}
            </div>

            {/* Explanation */}
            <ExplanationPanel
              explanation={currentQuestion.explanation}
              isCorrect={isCorrect}
              visible={revealed}
            />

            {/* Actions */}
            <div className="flex justify-end mt-6">
              {!revealed ? (
                <Button
                  variant="hero"
                  size="lg"
                  disabled={!selectedId}
                  onClick={handleSubmit}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button variant="hero" size="lg" onClick={handleNext}>
                  {questionIndex + 1 >= questionsTotal ? "View Results" : "Next Question →"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
