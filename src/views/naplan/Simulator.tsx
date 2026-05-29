import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "@/lib/router";
import { useQuery } from "@tanstack/react-query";
import { listApprovedQuestions, dbToPracticeQuestion, QuestionSubject } from "@/lib/questionsApi";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Flag, CheckCircle2, Clock, XCircle, LayoutGrid } from "lucide-react";
import { NaplanEngineService, type ExamMode } from "@/modules/assessment/naplanService";
import { useAuth } from "@/contexts/AuthContext";

export default function NaplanSimulator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const year = parseInt(searchParams.get("year") || "5");
  const subject = (searchParams.get("subject") || "maths") as QuestionSubject;
  const mode = (searchParams.get("mode") || "TIMED") as ExamMode;

  useEffect(() => {
    if (user && !sessionId) {
      NaplanEngineService.startSession(user.id, year, subject, mode)
        .then(session => setSessionId(session.id));
    }
  }, [mode, sessionId, subject, user, year]);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["naplan-sim", year, subject],
    queryFn: async () => {
      const dbQs = await listApprovedQuestions({ examType: "naplan", yearLevel: year, subject });
      return dbQs.map(dbToPracticeQuestion);
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [isReviewScreen, setIsReviewScreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes

  useEffect(() => {
    if (isLoading || isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading, isCompleted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No questions found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find any approved NAPLAN questions for Year {year} {subject}.</p>
        <Button onClick={() => navigate("/naplan")}>Return to Hub</Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;

  const handleSelectOption = (optionId: string) => {
    setAnswers({ ...answers, [currentQ.id]: optionId });
  };

  const toggleFlag = () => {
    setFlagged({ ...flagged, [currentQ.id]: !flagged[currentQ.id] });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleFinish = async () => {
    if (sessionId) {
      await NaplanEngineService.completeSession(sessionId);
    }
    setIsCompleted(true);
  };

  if (isCompleted) {
    const score = calculateScore();
    const xpGained = Math.round(score * 1.5) + 50;
    
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 border border-border shadow-2xl text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Exam Complete!</h1>
          <p className="text-muted-foreground mb-8">Year {year} {subject.charAt(0).toUpperCase() + subject.slice(1)}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-1">Score</p>
              <p className="text-3xl font-bold">{score}%</p>
            </div>
            <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
              <p className="text-sm font-medium text-orange-600 mb-1">XP Earned</p>
              <p className="text-3xl font-bold text-orange-600">+{xpGained}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button className="w-full h-12 text-lg rounded-xl" onClick={() => navigate("/dashboard?tab=parent-portal")}>View Detailed Report</Button>
            <Button variant="outline" className="w-full h-12 text-lg rounded-xl" onClick={() => navigate("/naplan")}>Back to Hub</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isReviewScreen) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-bold text-lg">Review Your Answers</h1>
          <Button variant="ghost" onClick={() => setIsReviewScreen(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exam
          </Button>
        </header>
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isFlagged = !!flagged[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsReviewScreen(false);
                  }}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    isAnswered ? "bg-primary/5 border-primary/30" : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-muted-foreground">Q{idx + 1}</span>
                    {isFlagged && <Flag className="h-4 w-4 text-orange-500 fill-orange-500" />}
                  </div>
                  {isAnswered ? (
                    <span className="inline-flex items-center text-xs font-bold text-success"><CheckCircle2 className="h-3 w-3 mr-1"/> Answered</span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-muted-foreground"><XCircle className="h-3 w-3 mr-1"/> Unanswered</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button size="lg" className="rounded-xl px-10 h-14" onClick={handleFinish}>
              Submit Exam
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      {/* Exam Header */}
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <h1 className="font-bold hidden sm:block">NAPLAN Year {year} {subject}</h1>
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
            <Clock className={`h-4 w-4 ${timeLeft < 300 ? "text-destructive animate-pulse" : "text-muted-foreground"}`} />
            <span className={`font-mono font-bold ${timeLeft < 300 ? "text-destructive" : ""}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {answeredCount} / {questions.length} Answered
            </span>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsReviewScreen(true)} className="gap-2">
            <LayoutGrid className="h-4 w-4" /> Review
          </Button>
          <Button size="sm" onClick={handleFinish}>Finish</Button>
        </div>
      </header>

      {/* Main Question Area */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 flex flex-col max-w-4xl">
        <div className="bg-card border border-border shadow-md rounded-[2rem] p-6 sm:p-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
            <span className="text-lg font-black text-primary bg-primary/10 px-4 py-1.5 rounded-xl">
              Question {currentIndex + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFlag}
              className={`gap-2 rounded-xl ${flagged[currentQ.id] ? "text-orange-500 hover:text-orange-600 bg-orange-500/10 hover:bg-orange-500/20" : "text-muted-foreground"}`}
            >
              <Flag className={`h-4 w-4 ${flagged[currentQ.id] ? "fill-current" : ""}`} />
              {flagged[currentQ.id] ? "Flagged" : "Flag for review"}
            </Button>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-10 flex-1">
            <p className="text-xl leading-relaxed text-foreground font-medium">{currentQ.content}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-auto">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all group flex items-start gap-4 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 bg-background"
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 flex items-center justify-center w-7 h-7 rounded-full border-2 text-xs font-bold transition-colors ${
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground group-hover:border-primary"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className={`text-base font-medium ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="h-20 border-t border-border bg-card px-6 flex items-center justify-between sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="rounded-xl w-32"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Previous
        </Button>

        <div className="hidden sm:flex gap-1 overflow-x-auto max-w-md px-4 pb-2 pt-2 scrollbar-hide">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-10 h-10 shrink-0 rounded-lg text-sm font-bold flex items-center justify-center transition-all relative ${
                currentIndex === idx
                  ? "bg-foreground text-background scale-110 shadow-lg z-10"
                  : answers[q.id]
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {idx + 1}
              {flagged[q.id] && <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-card" />}
            </button>
          ))}
        </div>

        {currentIndex === questions.length - 1 ? (
          <Button size="lg" onClick={() => setIsReviewScreen(true)} className="rounded-xl w-32 bg-foreground text-background hover:bg-foreground/90">
            Review <LayoutGrid className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="rounded-xl w-32"
          >
            Next <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </footer>
    </div>
  );
}
