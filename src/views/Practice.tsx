import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "@/lib/router";
import { ArrowLeft, Zap, BookOpen, Loader2, CheckCircle2, Clock, GraduationCap, Target, UserPlus } from "lucide-react";
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
import { listApprovedQuestions, dbToPracticeQuestion, type QuestionExamType, type QuestionSubject } from "@/lib/questionsApi";
import { recordAttempt } from "@/lib/statsApi";
import { useAuth } from "@/contexts/AuthContext";
import { FREE_DAILY_LIMIT, hasPractisedToday, loadFreeSampleQuestions } from "@/lib/freeAccess";
import { Lock, Sparkles } from "lucide-react";
import { examCards, getExamCard } from "@/data/examCatalog";

const TOTAL_QUESTIONS = 10;
const GUEST_FREE_QUESTION_LIMIT = 5;
const LABELS = ["A", "B", "C", "D"];
const SUBJECT_CHOICES: { value: QuestionSubject; label: string; desc: string }[] = [
  { value: "maths", label: "Maths", desc: "Number, data and problem solving" },
  { value: "science", label: "Science", desc: "Biology, physics and investigation skills" },
  { value: "reading", label: "Reading", desc: "Comprehension and inference" },
  { value: "writing", label: "Writing", desc: "Structure, expression and editing" },
  { value: "reasoning", label: "Reasoning", desc: "Logic and selective-style thinking" },
];
const YEAR_CHOICES = [3, 4, 5, 6, 7, 8, 9] as const;

interface SessionResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

export default function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectParam = searchParams.get("subject") as QuestionSubject | null;
  const examParam = searchParams.get("exam") as QuestionExamType | null;
  const testId = searchParams.get("testId");
  const selectedExam = getExamCard(testId);
  const yearParam = searchParams.get("year");
  const hasDeepLink = Boolean(subjectParam || examParam || testId || searchParams.get("start"));
  const { profile } = useUserProfile();
  const { profile: authProfile, user } = useAuth();
  const isGuest = !user;
  const isFree = (authProfile?.tier ?? "free") !== "pro";
  const isBlocked = !!authProfile?.is_blocked;
  const [practiceStarted, setPracticeStarted] = useState(hasDeepLink);
  const [selectedSubject, setSelectedSubject] = useState<QuestionSubject>(subjectParam ?? "reasoning");
  const [selectedExamType, setSelectedExamType] = useState<QuestionExamType>(selectedExam?.dbExamType ?? examParam ?? "selective");
  const [selectedYear, setSelectedYear] = useState<number>(yearParam ? Number(yearParam) : profile.yearLevel || 6);
  const subjectFilter = practiceStarted ? selectedSubject : null;
  const examFilter = practiceStarted ? selectedExamType : null;
  const targetYear = selectedYear;
  const baseSessionQuestionTarget = selectedExam
    ? Math.min(selectedExam.questionCount === 1 ? 1 : TOTAL_QUESTIONS, TOTAL_QUESTIONS)
    : TOTAL_QUESTIONS;
  const sessionQuestionTarget = isGuest
    ? Math.min(baseSessionQuestionTarget, GUEST_FREE_QUESTION_LIMIT)
    : baseSessionQuestionTarget;

  const [pool, setPool] = useState<Question[] | null>(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

  // Load questions: free users get a fixed sample set; pro users get the full bank.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!practiceStarted) {
        setPool(null);
        return;
      }
      // Free-tier daily gate
      if (isFree && user) {
        const reached = await hasPractisedToday(user.id);
        if (cancelled) return;
        if (reached) {
          setDailyLimitReached(true);
          setPool([]);
          return;
        }
      }
      try {
        const dbQs = isFree
          ? await loadFreeSampleQuestions(
              targetYear,
              subjectFilter ? (subjectFilter as QuestionSubject) : undefined
            )
          : await listApprovedQuestions({
              ...(subjectFilter ? { subject: subjectFilter as QuestionSubject } : {}),
              ...(examFilter ? { examType: examFilter } : {}),
              yearLevel: targetYear,
            });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFilter, examFilter, isFree, user?.id, targetYear, practiceStarted]);

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
    if (questionIndex + 1 >= sessionQuestionTarget) {
      setSessionDone(true);
      return;
    }
    setQuestionIndex((i) => i + 1);
    const nextAnsweredIds = currentQuestion
      ? new Set([...answeredIds, currentQuestion.id])
      : answeredIds;
    pickNextQuestion(difficulty, nextAnsweredIds);
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

  const startPractice = () => {
    setResults([]);
    setQuestionIndex(0);
    setDifficulty(2);
    setStreak(0);
    setAnsweredIds(new Set());
    setSessionDone(false);
    setCurrentQuestion(null);
    setPool(null);
    totalSessionTime.current = 0;
    setPracticeStarted(true);
    setSearchParams({
      start: "1",
      subject: selectedSubject,
      exam: selectedExamType,
      year: String(selectedYear),
    });
  };

  const questionsTotal = Math.min(sessionQuestionTarget, filteredQuestions.length);

  if (isBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <Lock className="w-10 h-10 text-destructive" />
        <h1 className="text-2xl font-bold">Account access paused</h1>
        <p className="text-muted-foreground max-w-md">
          Your account has been blocked by an administrator. Please contact support if you believe this is an error.
        </p>
        <Button asChild variant="outline"><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
    );
  }

  if (dailyLimitReached) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-6 text-center">
        <Sparkles className="w-10 h-10 text-accent" />
        <h1 className="text-2xl font-bold">You're done for today!</h1>
        <p className="text-muted-foreground max-w-md">
          Free accounts include one practice session per day with {FREE_DAILY_LIMIT} curated
          Year {targetYear} questions. Upgrade to <strong>Pro</strong> for unlimited access to the
          full question library.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="hero"><Link to="/info/pricing">Upgrade to Pro</Link></Button>
          <Button asChild variant="outline"><Link to="/dashboard">Back to dashboard</Link></Button>
        </div>
      </div>
    );
  }

  if (!practiceStarted) {
    return (
      <PracticeStart
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedExamType={selectedExamType}
        setSelectedExamType={setSelectedExamType}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onStart={startPractice}
        isGuest={isGuest}
      />
    );
  }

  if (sessionDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <SessionSummary
          results={results}
          totalTime={totalSessionTime.current}
          onRestart={handleRestart}
          isFree={isFree}
          isGuest={isGuest}
        />
      </div>
    );
  }

  if (!currentQuestion) {
    if (pool && filteredQuestions.length === 0) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <BookOpen className="mx-auto h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold">No questions found for this choice yet</h1>
            <p className="text-muted-foreground">
              Try another subject, year level or exam style while the library continues to grow.
            </p>
            <Button onClick={() => setPracticeStarted(false)} variant="hero">
              Choose another practice set
            </Button>
          </div>
        </div>
      );
    }
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
            <Link to={isGuest ? "/" : "/dashboard"}><ArrowLeft className="w-4 h-4 mr-1" /> {isGuest ? "Home" : "Dashboard"}</Link>
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
        {selectedExam && (
          <div className="mb-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{selectedExam.category}</p>
                <h1 className="font-bold">{selectedExam.title}</h1>
                <p className="text-xs text-muted-foreground mt-1">{selectedExam.description}</p>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                <div>{selectedExam.questionCountLabel}</div>
                <div>{selectedExam.estimatedMinutes} min exam block</div>
              </div>
            </div>
          </div>
        )}
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

function PracticeStart({
  selectedSubject,
  setSelectedSubject,
  selectedExamType,
  setSelectedExamType,
  selectedYear,
  setSelectedYear,
  onStart,
  isGuest,
}: {
  selectedSubject: QuestionSubject;
  setSelectedSubject: (subject: QuestionSubject) => void;
  selectedExamType: QuestionExamType;
  setSelectedExamType: (examType: QuestionExamType) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  onStart: () => void;
  isGuest: boolean;
}) {
  const examTypeOptions: { value: QuestionExamType; label: string; desc: string }[] = [
    { value: "selective", label: "Selective", desc: "NSW and VIC entry prep" },
    { value: "scholarship", label: "Scholarship", desc: "ACER and EduTest style" },
    { value: "general", label: "ICAS / Senior", desc: "ICAS, HSC and VCE skills" },
    { value: "naplan", label: "NAPLAN", desc: "Years 3, 5, 7 and 9" },
  ];
  const relatedPathways = examCards.filter((card) => card.dbExamType === selectedExamType).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center overflow-hidden rounded-xl shadow-sm">
            <img src="/logo.png" alt="ScholarEdge Logo" className="h-10 w-auto object-contain" />
          </Link>
          {isGuest ? (
            <Button asChild variant="outline">
              <Link to="/auth"><UserPlus className="h-4 w-4" /> Save progress</Link>
            </Button>
          ) : (
            <Button asChild variant="outline"><Link to="/dashboard">Dashboard</Link></Button>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Free practice starts here
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
              Try a real question before signing up.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Choose a subject, answer a 5-question adaptive preview, and see explanations immediately. Create an account to save the progress map and continue practising.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "5 questions before signup",
              "Explanations included",
              "Progress map after practice",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-card p-4 text-sm font-medium">
                <CheckCircle2 className="mb-2 h-5 w-5 text-success" />
                {item}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-bold">What happens next?</h2>
            </div>
            <div className="grid gap-3">
              {[
                ["Diagnose", "We start with a question matched to the year and subject."],
                ["Explain", "Every answer reveals a clear worked explanation."],
                ["Report", "The summary shows score, timing and the next focus area."],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-muted/40 p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-black">Start free practice</h2>
            <p className="mt-1 text-sm text-muted-foreground">Takes less than 30 seconds to start.</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold">1. Choose a subject</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {SUBJECT_CHOICES.map((subject) => (
                  <button
                    key={subject.value}
                    type="button"
                    onClick={() => setSelectedSubject(subject.value)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      selectedSubject === subject.value
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <p className="font-bold">{subject.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{subject.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">2. Choose year level</p>
              <div className="flex flex-wrap gap-2">
                {YEAR_CHOICES.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedYear === year
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    Year {year}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">3. Choose exam style</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {examTypeOptions.map((exam) => (
                  <button
                    key={exam.value}
                    type="button"
                    onClick={() => setSelectedExamType(exam.value)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      selectedExamType === exam.value
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <p className="font-bold">{exam.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{exam.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4 text-primary" />
                Matching pathways
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedPathways.map((pathway) => (
                  <span key={pathway.id} className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {pathway.title}
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={onStart} variant="hero" size="lg" className="h-14 w-full rounded-full text-lg">
              Start Free Practice
              <Clock className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
