import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BarChart3, Target, Trophy } from "lucide-react";
import { ParticleField } from "./ParticleField";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      <ParticleField />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            The #1 AI Tutor for Australian Students
          </motion.div>

          <h1 className="text-hero mb-6 text-balance">
            <span className="block text-foreground">Help Your Child Excel in</span>
            <span className="text-gradient-primary block">NAPLAN, Scholarships & Selective Exams</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            AI-powered personalised learning built for Australian students. We make practice engaging and give parents clear insights into their child's progress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button variant="hero" size="lg" className="group rounded-full px-8 text-lg h-14 shadow-lg shadow-primary/25" asChild>
              <Link to="/practice">
                Start Free Diagnostic Test
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 border-2" asChild>
              <a href="#categories">Explore Practice Exams</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating device mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="rounded-[2.5rem] border border-border/50 bg-background/50 p-3 shadow-2xl backdrop-blur-xl md:p-5">
            <div className="overflow-hidden rounded-[2rem] bg-card border border-border/50 shadow-inner">
              <MockAppUI />
            </div>
          </div>
          {/* Glow effect behind mockup */}
          <div className="absolute -inset-8 -z-10 rounded-full bg-primary/20 blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
};

const MockAppUI = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-muted/30">
    {/* Left Column: Gamified Stats */}
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-background p-5 border border-border shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
            <p className="text-lg font-bold">14 Days</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-background p-5 border border-border shadow-sm flex-1">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Target className="h-4 w-4 text-primary"/> Daily Goals</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Complete 20 Questions</span>
              <span className="text-muted-foreground">15/20</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[75%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Master Fractions</span>
              <span className="text-muted-foreground">80%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-success rounded-full w-[80%]" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Middle Column: Active Question */}
    <div className="md:col-span-2 rounded-2xl bg-background p-6 border border-border shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Selective School Entry • Mathematics</p>
          <p className="text-sm text-muted-foreground mt-1">Diagnostic Assessment</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
          Q4
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-base md:text-lg font-medium mb-6 leading-relaxed">
          If a train travels 3/4 of a kilometre in 1/2 a minute, how fast is it travelling in kilometres per hour?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {["90 km/h", "60 km/h", "120 km/h", "45 km/h"].map((opt, i) => (
            <div
              key={opt}
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                i === 0
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium">{opt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button className="rounded-full px-6">Check Answer</Button>
      </div>
    </div>
  </div>
);
