import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

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
        <div className="flex min-h-[72vh] items-center">
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

          </motion.div>
        </div>
      </div>
    </section>
  );
};
