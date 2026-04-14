import { motion } from "framer-motion";
import { Sparkles, BarChart3, Target, Clock, BookCheck, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Question Generation",
    description: "Unlimited practice with AI that generates fresh, curriculum-aligned questions tailored to your level.",
  },
  {
    icon: Target,
    title: "Adaptive Difficulty",
    description: "Questions get harder when you're flying and easier when you need support. Always in your zone of growth.",
  },
  {
    icon: BookCheck,
    title: "Instant Explanations",
    description: "Every question comes with a detailed worked solution so you understand the why, not just the what.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track mastery across topics, identify weak spots, and watch your skills grow over time.",
  },
  {
    icon: Clock,
    title: "Timed Practice",
    description: "Simulate real test conditions with per-question and full-test timers to build speed and confidence.",
  },
  {
    icon: Users,
    title: "Parent Dashboard",
    description: "Parents can monitor progress, receive weekly reports, and see exactly where their child excels.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="section-dark py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-display mb-4 text-white">Smarter prep, better results.</h2>
          <p className="text-lg text-white/60">
            Built by educators and engineers who believe every Australian student deserves access to world-class test preparation.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
