import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Brain, GraduationCap, Award } from "lucide-react";

const categories = [
  {
    icon: BookOpen,
    title: "NAPLAN",
    description: "Year 3, 5, 7 & 9 practice across Reading, Writing, Conventions & Numeracy. Aligned to official ACARA standards.",
    color: "bg-subject-maths/10 text-subject-maths",
    iconBg: "bg-subject-maths",
    tags: ["Year 3–9", "All domains"],
  },
  {
    icon: Brain,
    title: "Selective Schools",
    description: "NSW OC & Selective, VIC Selective Entry, QLD Academic Talent, WA ASET. State-specific preparation.",
    color: "bg-subject-writing/10 text-subject-writing",
    iconBg: "bg-subject-writing",
    tags: ["NSW", "VIC", "QLD", "WA"],
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    description: "ACER, EduTest and school-specific scholarship tests. Verbal, Numerical & Abstract Reasoning practice.",
    color: "bg-subject-reasoning/10 text-subject-reasoning",
    iconBg: "bg-subject-reasoning",
    tags: ["ACER", "EduTest"],
  },
  {
    icon: Award,
    title: "Subject Deep-Dives",
    description: "AI-generated curriculum-aligned questions for Mathematics, English & Reasoning. Unlimited practice.",
    color: "bg-subject-reading/10 text-subject-reading",
    iconBg: "bg-subject-reading",
    tags: ["AI-powered", "Adaptive"],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const TestCategories = () => {
  return (
    <section id="tests" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-display mb-4">Every test. One platform.</h2>
          <p className="text-lg text-muted-foreground">
            From NAPLAN to elite scholarships, AceIt covers every major Australian exam with precision-crafted practice.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.title} variants={cardVariants}>
            <Link
              to="/practice"
              className="card-hover group block cursor-pointer rounded-2xl border border-border bg-card p-6 h-full"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`}>
                <cat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{cat.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
              <div className="flex flex-wrap gap-2">
                {cat.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
