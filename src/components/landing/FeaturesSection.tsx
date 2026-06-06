import { motion } from "framer-motion";
import { Sparkles, BarChart3, Target, Clock, BookCheck, Users, Bot, FileText } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Fresh AI Questions",
    description: "Generate new practice for NAPLAN, ICAS, selective entry, ACER, EduTest, VCE and HSC pathways.",
  },
  {
    icon: Target,
    title: "Adaptive Difficulty",
    description: "The app adjusts challenge as students improve, keeping practice inside the right learning zone.",
  },
  {
    icon: BookCheck,
    title: "Worked Explanations",
    description: "Every answer includes a clear explanation so students learn from mistakes immediately.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Parents see strengths, weak topics, readiness and practice trends without decoding spreadsheets.",
  },
  {
    icon: Clock,
    title: "Timed Practice",
    description: "Exam-style pacing helps students build speed before the real assessment.",
  },
  {
    icon: Users,
    title: "Tutor Sharing",
    description: "Progress summaries can be shared with tutors so lessons focus on the highest-impact gaps.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="section-dark py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Bot className="h-4 w-4 text-primary" />
              AI tutor, parent dashboard and practice engine
            </div>
            <h2 className="text-display mb-5 text-white">A calmer way to know what to practise next.</h2>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/65">
              ScholarDrill turns practice results into a clear loop: diagnose, practise, explain, reward and report.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl">
              <div className="rounded-[1.5rem] bg-background p-5 text-foreground">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">Today's Learning Loop</p>
                    <h3 className="text-xl font-black">From attempt to next step</h3>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Live</div>
                </div>

                <div className="space-y-3">
                  {[
                    ["1", "Diagnostic found a gap", "Reading inference accuracy is 54%"],
                    ["2", "AI coach explains why", "Student misses implied meaning in contrast words"],
                    ["3", "Daily quest adjusts", "6 inference questions, 90 seconds each"],
                    ["4", "Parent report updates", "Tutor-share summary ready after practice"],
                  ].map(([step, title, detail], i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-muted/35 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                        {step}
                      </div>
                      <div>
                        <p className="font-bold">{title}</p>
                        <p className="text-sm text-muted-foreground">{detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-success/10 p-4">
                    <FileText className="mb-2 h-5 w-5 text-success" />
                    <p className="text-sm font-bold">Downloadable parent report</p>
                    <p className="text-xs text-muted-foreground">Ready after each week of practice</p>
                  </div>
                  <div className="rounded-2xl bg-orange-500/10 p-4">
                    <Sparkles className="mb-2 h-5 w-5 text-orange-500" />
                    <p className="text-sm font-bold">Motivation built in</p>
                    <p className="text-xs text-muted-foreground">XP, streaks and quests keep rhythm</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
