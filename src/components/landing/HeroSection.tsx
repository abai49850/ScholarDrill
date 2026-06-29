import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const skills = [
  { label: "Reasoning", value: 82, color: "bg-primary" },
  { label: "Science", value: 71, color: "bg-success" },
  { label: "Writing", value: 48, color: "bg-orange-500" },
];

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_85%,rgba(245,158,11,0.14),transparent_28%),radial-gradient(circle_at_92%_78%,rgba(239,71,111,0.13),transparent_30%),linear-gradient(180deg,#eef1f5,#f8fafc)] px-4 pt-24 md:px-6 md:pt-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/90 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px),linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] bg-[length:100%_156px,190px_100%,100%_100%] shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
        <div className="px-6 pb-0 pt-14 text-center md:px-10 md:pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3.5 py-2 text-xs font-extrabold text-primary shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Built for Australian exam practice
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-balance text-[clamp(2.15rem,4vw,3.35rem)] font-black leading-[1.08] tracking-[-0.035em] text-slate-900"
          >
            Know what to practise next.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Short attempts reveal the exact skill to work on, then ScholarEdge builds the next practice set.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button variant="hero" size="lg" className="group h-14 rounded-full px-7 shadow-lg shadow-primary/20" asChild>
              <Link to="/practice">
                Start Free Practice
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="h-14 rounded-full bg-background/80 px-7 backdrop-blur" asChild>
              <Link to="#features">See how it works</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-muted-foreground"
          >
            {["5-question preview", "No credit card"].map((benefit) => (
              <span key={benefit} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-2 shadow-sm backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                {benefit}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-8 min-h-[500px] w-[min(900px,calc(100%-1.5rem))] overflow-hidden rounded-t-[2rem] border border-b-0 border-border/90 bg-[radial-gradient(circle_at_4%_98%,rgba(245,158,11,0.38),transparent_22%),radial-gradient(circle_at_96%_98%,rgba(239,71,111,0.35),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(241,245,249,0.78))] shadow-[inset_0_1px_rgba(255,255,255,0.9),0_24px_80px_rgba(15,23,42,0.12)] md:min-h-[430px]"
        >
          <div className="absolute left-5 right-5 top-8 rounded-[1.6rem] border border-border/90 bg-background/90 p-5 shadow-[0_25px_70px_rgba(15,23,42,0.14)] backdrop-blur md:left-16 md:right-24 md:top-12 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-black tracking-tight text-foreground">Maya&apos;s progress map</p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">Year 6 - selective entry prep</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-xs font-extrabold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                On track
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Subject readiness</p>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.label} className="grid grid-cols-[86px_1fr_38px] items-center gap-3 text-xs font-bold text-slate-700">
                      <span>{skill.label}</span>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div className={`h-full rounded-full ${skill.color}`} style={{ width: `${skill.value}%` }} />
                      </div>
                      <span>{skill.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">AI coach next step</p>
                <p className="text-2xl font-black tracking-tight">15 min today</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Focus on variables in science, then complete one reasoning speed round.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute left-8 top-[19rem] hidden rounded-2xl border border-border/90 bg-background/95 px-4 py-3 text-xs font-semibold text-muted-foreground shadow-xl backdrop-blur md:block">
            <strong className="mb-1 block text-sm text-foreground">Science gap detected</strong>
            Variables and reliability need practice
          </div>

          <div className="absolute right-7 top-36 hidden rounded-2xl border border-border/90 bg-background/95 px-4 py-3 text-xs font-semibold text-muted-foreground shadow-xl backdrop-blur md:block">
            <strong className="mb-1 block text-sm text-foreground">Parent assigned</strong>
            Reasoning set ready for today
          </div>

          <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 rounded-2xl border border-border/90 bg-background/95 px-4 py-3 text-xs font-semibold text-muted-foreground shadow-xl backdrop-blur md:block">
            <strong className="mb-1 block text-sm text-foreground">AI explanation ready</strong>
            Shows why the correct answer works
          </div>
        </motion.div>
      </div>
    </section>
  );
};
