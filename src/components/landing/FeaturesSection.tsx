import { motion } from "framer-motion";
import { Brain, FileText, Sparkles, Target } from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "Start with a short attempt",
    description: "Students answer a focused set of questions without needing to create an account first.",
    accent: "bg-slate-900",
  },
  {
    icon: Target,
    title: "Find the gap",
    description: "ScholarEdge identifies the skill underneath the mistake, not just the final score.",
    accent: "bg-primary",
  },
  {
    icon: Sparkles,
    title: "Practise the right skill",
    description: "Targeted sets adjust across maths, science, reading, writing and reasoning.",
    accent: "bg-success",
  },
  {
    icon: FileText,
    title: "Explain it to parents",
    description: "Reports turn progress data into practical next steps a parent can act on.",
    accent: "bg-orange-500",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="border-t border-border/70 bg-background py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mb-10 grid items-end gap-8 lg:grid-cols-[0.95fr_0.72fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-primary">Product loop</p>
            <h2 className="text-display max-w-3xl">From one attempt to a clearer practice plan.</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-base leading-relaxed text-muted-foreground"
          >
            The page now explains ScholarEdge through the diagnose, practise, explain and report loop before asking parents to compare every exam pathway.
          </motion.p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[220px] flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-[0_14px_40px_rgba(15,23,42,0.07)]"
            >
              <div className={`mb-8 flex h-11 w-11 items-center justify-center rounded-2xl ${step.accent} text-white`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-black tracking-tight">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
