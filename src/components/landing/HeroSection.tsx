import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, Bot, CheckCircle2, Sparkles, Target, Trophy } from "lucide-react";

const floatingStats = [
  { label: "Daily Quest", value: "3/4 done", icon: Target },
  { label: "AI Coach", value: "Next: fractions", icon: Bot },
  { label: "XP Streak", value: "14 days", icon: Trophy },
];

const startBenefits = [
  "Takes less than 30 seconds to start",
  "Works for maths, science, and more",
  "No setup required",
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-[94vh] overflow-hidden pt-24 pb-10">
      <img
        src="/images/landing-students-hero.webp"
        alt="Australian students using ScholarDrill-style practice on a laptop"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/42" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid min-h-[78vh] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur"
            >
              <Sparkles className="h-4 w-4" />
              AI-powered exam prep for Australian students
            </motion.div>

            <h1 className="text-hero mb-6 text-balance">
              <span className="block text-foreground">Fix your child's</span>
              <span className="text-gradient-primary block">learning gaps automatically</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              Choose a subject, and we'll pinpoint where your child is struggling, generate targeted questions, and provide clear explanations - so they improve faster with less frustration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button variant="hero" size="lg" className="group h-14 rounded-full px-8 text-lg shadow-lg shadow-primary/25" asChild>
                <Link to="/practice">
                  Start Free Practice
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-full border-2 bg-background/75 px-8 text-lg backdrop-blur" asChild>
                <a href="#features">See How It Works</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-5 flex max-w-2xl flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center"
            >
              {startBenefits.map((benefit) => (
                <span key={benefit} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/72 px-3 py-2 shadow-sm backdrop-blur">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {benefit}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.6 }}
              className="mt-8 grid max-w-xl grid-cols-3 gap-3"
            >
              {floatingStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/70 bg-background/76 p-3 shadow-sm backdrop-blur">
                  <item.icon className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <ProductSnapshot />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProductSnapshot = () => (
  <div className="relative ml-auto max-w-2xl">
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-[2rem] border border-white/45 bg-white/88 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="rounded-[1.5rem] border border-border bg-background p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live Diagnostic</p>
            <h2 className="text-xl font-black text-foreground">Year 5 NAPLAN Readiness</h2>
          </div>
          <div className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">On track</div>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BookOpenCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Questions solved</p>
                  <p className="text-2xl font-black">1,240</p>
                </div>
              </div>
            </div>
            {[
              ["Numeracy", "90%", "bg-subject-maths"],
              ["Reading", "76%", "bg-subject-reading"],
              ["Writing", "52%", "bg-orange-500"],
            ].map(([label, value, colour]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: value }}
                    transition={{ delay: 0.9, duration: 1.1 }}
                    className={`h-full rounded-full ${colour}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">AI Coach</p>
            <div className="space-y-3">
              <div className="rounded-2xl bg-background p-3 text-sm shadow-sm">
                Strong progress in fractions. Next, practise multi-step word problems under 90 seconds.
              </div>
              <div className="rounded-2xl bg-primary p-3 text-sm font-medium text-primary-foreground shadow-sm">
                Recommended: Selective Maths - Quantitative Reasoning
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background p-3">
                <p className="text-xs text-muted-foreground">XP today</p>
                <p className="text-xl font-black">420</p>
              </div>
              <div className="rounded-xl bg-background p-3">
                <p className="text-xs text-muted-foreground">Weak topic</p>
                <p className="text-sm font-bold">Inference</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="absolute -bottom-7 left-8 rounded-2xl border border-border bg-background p-4 shadow-xl"
    >
      <p className="text-xs text-muted-foreground">Parent report ready</p>
      <p className="font-bold text-foreground">3 strengths, 2 focus areas</p>
    </motion.div>
  </div>
);
