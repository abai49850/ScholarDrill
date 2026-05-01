import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { ParticleField } from "./ParticleField";
import { useAuth } from "@/contexts/AuthContext";

export const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <ParticleField />

      <div className="container relative z-10 mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            AI-powered test prep for Australian students
          </motion.div>

          <h1 className="text-hero mb-6">
            <span className="block">Ace every test.</span>
            <span className="text-gradient-primary block">Every time.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            NAPLAN, selective schools, scholarships — master them all with
            AI‑generated practice, adaptive difficulty, and instant explanations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button variant="hero" size="lg" className="group" asChild>
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Open Dashboard" : "Start practising free"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <a href="#features">See how it works</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              10,000+ students
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              500,000+ questions practised
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              All Australian states
            </span>
          </motion.div>
        </motion.div>

        {/* Floating device mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-4xl animate-float"
        >
          <div className="rounded-2xl border border-border bg-card p-2 shadow-xl md:p-4">
            <div className="overflow-hidden rounded-xl bg-secondary">
              <MockAppUI />
            </div>
          </div>
          {/* Glow effect behind mockup */}
          <div className="absolute -inset-8 -z-10 rounded-3xl bg-primary/5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

const MockAppUI = () => (
  <div className="flex flex-col gap-4 p-6 md:p-8">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground">NAPLAN Year 5 • Numeracy</p>
        <p className="text-lg font-bold text-foreground">Question 12 of 40</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-border">
          <div className="h-full w-[30%] rounded-full bg-primary transition-all" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">30%</span>
      </div>
    </div>
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 text-sm font-medium text-foreground md:text-base">
        A rectangle has a length of 12 cm and a width of 8 cm. What is the area of the rectangle?
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {["96 cm²", "40 cm²", "20 cm²", "80 cm²"].map((opt, i) => (
          <button
            key={opt}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
              i === 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  </div>
);
