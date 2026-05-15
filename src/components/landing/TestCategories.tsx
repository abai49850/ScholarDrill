import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Brain, GraduationCap, Microscope, Award } from "lucide-react";

const categories = [
  {
    icon: BookOpen,
    title: "NAPLAN",
    description: "Year 3, 5, 7 & 9 practice across Reading, Writing, Conventions & Numeracy. Aligned to official ACARA standards.",
    iconBg: "bg-subject-maths",
    tags: ["Year 3–9", "All domains"],
    href: "/lp/naplan-practice-tests",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Exams",
    description: "ACER, EduTest and school-specific scholarship tests. Verbal, Numerical & Abstract Reasoning practice.",
    iconBg: "bg-subject-reasoning",
    tags: ["ACER", "EduTest"],
    href: "/lp/scholarship-exam-prep",
  },
  {
    icon: Brain,
    title: "Selective School Entry",
    description: "NSW OC & Selective, VIC Selective Entry, QLD Academic Talent, WA ASET. State-specific preparation.",
    iconBg: "bg-subject-writing",
    tags: ["NSW", "VIC", "QLD", "WA"],
    href: "/lp/selective-school-test-prep",
  },
  {
    icon: Microscope,
    title: "ICAS",
    description: "Prepare for ICAS assessments with challenging questions designed to test higher-order thinking skills.",
    iconBg: "bg-subject-reading",
    tags: ["Primary", "Secondary"],
    href: "/lp/icas-english-practice",
  },
  {
    icon: Award,
    title: "VCE/HSC",
    description: "Master senior secondary exams with comprehensive practice and AI-powered feedback for VCE and HSC subjects.",
    iconBg: "bg-primary",
    tags: ["Years 11-12", "ATAR Prep"],
    href: "/lp/vce-english-exam-prep",
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
    <section id="categories" className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="text-display mb-6">Every test. One platform.</h2>
          <p className="text-lg text-muted-foreground">
            From NAPLAN to elite scholarships, ScholarDrill covers every major Australian exam with precision-crafted, curriculum-aligned practice.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat) => (
            <motion.div key={cat.title} variants={cardVariants}>
            <Link
              to={cat.href}
              className="group block cursor-pointer rounded-[2rem] border border-border bg-card p-8 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 relative overflow-hidden"
            >
              <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] ${cat.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">{cat.title}</h3>
              <p className="mb-6 text-base leading-relaxed text-muted-foreground">{cat.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {cat.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary/80 px-4 py-1.5 text-xs font-semibold text-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Subtle background glow on hover */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${cat.iconBg} rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
            </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
