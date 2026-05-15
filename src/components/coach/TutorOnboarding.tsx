import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tutors, type TutorPersonality } from "@/data/tutors";

const subjects = ["Maths", "Reading", "Writing", "Science", "NAPLAN Prep", "Scholarships", "Selective Entry", "Spelling", "Grammar"];

interface Props {
  onComplete: (tutor: TutorPersonality, goals: string[]) => void;
}

export const TutorOnboarding = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<TutorPersonality | null>(null);
  const [goals, setGoals] = useState<string[]>([]);

  const toggleGoal = (s: string) => setGoals(g => g.includes(s) ? g.filter(x => x !== s) : [...g, s]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">

        {/* STEP 0: Pick Tutor */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black tracking-tight mb-3">Choose your Study Buddy</h1>
              <p className="text-muted-foreground text-lg">Pick the tutor personality that feels right for you. You can change this anytime.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {tutors.map((tutor, i) => (
                <motion.button
                  key={tutor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(tutor)}
                  className={`relative text-left p-6 rounded-[2rem] border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${
                    selected?.id === tutor.id
                      ? `${tutor.borderClass} ${tutor.bgClass} shadow-lg scale-[1.02]`
                      : "border-border bg-card"
                  }`}
                >
                  {selected?.id === tutor.id && (
                    <div className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br ${tutor.gradientClass}`}>
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl border-2 overflow-hidden shrink-0 ${selected?.id === tutor.id ? tutor.borderClass : "border-border"} bg-muted`}>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.avatarSeed}&backgroundColor=transparent`}
                        alt={tutor.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{tutor.emoji}</span>
                        <h3 className="font-black text-xl">{tutor.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{tutor.tagline}</p>
                    </div>
                  </div>

                  <div className={`text-xs rounded-xl p-3 italic leading-relaxed ${tutor.bgClass} ${tutor.textClass} border ${tutor.borderClass}`}>
                    "{tutor.greeting.slice(0, 100)}…"
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                disabled={!selected}
                size="lg"
                className={`rounded-full px-12 h-14 text-lg transition-all ${selected ? `bg-gradient-to-r ${selected.gradientClass} text-white border-0 shadow-lg` : ""}`}
                onClick={() => setStep(1)}
              >
                Continue with {selected?.name || "…"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Goals */}
        {step === 1 && selected && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-2xl text-center">
            <div className="w-20 h-20 rounded-full border-4 overflow-hidden mx-auto mb-6 bg-muted shadow-md" style={{ borderColor: selected.color }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selected.avatarSeed}&backgroundColor=transparent`} alt={selected.name} className="w-full h-full object-contain" />
            </div>

            <h2 className="text-2xl font-black mb-2">{selected.emoji} What do you want to work on?</h2>
            <p className="text-muted-foreground mb-8">Pick one or more — {selected.name} will focus your session on these areas.</p>

            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleGoal(s)}
                  className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                    goals.includes(s)
                      ? `${selected.bgClass} ${selected.textClass} ${selected.borderClass} scale-105 shadow-sm`
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {goals.includes(s) && "✓ "}{s}
                </button>
              ))}
            </div>

            <Button
              disabled={goals.length === 0}
              size="lg"
              className={`rounded-full px-12 h-14 text-lg ${goals.length > 0 ? `bg-gradient-to-r ${selected.gradientClass} text-white border-0 shadow-lg` : ""}`}
              onClick={() => setStep(2)}
            >
              Let's Go! <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* STEP 2: Animated Intro */}
        {step === 2 && selected && (
          <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-28 h-28 rounded-full border-4 overflow-hidden mx-auto mb-6 bg-muted shadow-xl"
              style={{ borderColor: selected.color }}
            >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selected.avatarSeed}&backgroundColor=transparent`} alt={selected.name} className="w-full h-full object-contain" />
            </motion.div>

            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${selected.bgClass} ${selected.textClass} border ${selected.borderClass}`}>
              {selected.emoji} {selected.name} is ready!
            </div>

            <div className={`p-6 rounded-3xl border-2 text-left mb-8 ${selected.bgClass} ${selected.borderClass}`}>
              <p className={`text-base font-medium leading-relaxed ${selected.textClass}`}>"{selected.greeting}"</p>
            </div>

            <Button
              size="lg"
              className={`rounded-full px-12 h-14 text-lg bg-gradient-to-r ${selected.gradientClass} text-white border-0 shadow-xl`}
              onClick={() => onComplete(selected, goals)}
            >
              Start Chatting! {selected.emoji}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step indicator */}
      <div className="flex gap-2 mt-12">
        {[0, 1, 2].map((s) => (
          <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/50" : "w-2 bg-border"}`} />
        ))}
      </div>
    </div>
  );
};
