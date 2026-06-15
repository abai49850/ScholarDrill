import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { BookOpen, Brain, GraduationCap, Microscope, Award } from "lucide-react";

const categories = [
  {
    icon: Brain,
    title: "Selective School Entry",
    description: "State-specific thinking skills, maths, reading and writing for NSW and VIC-style entry.",
    accent: "border-t-violet-500 bg-violet-50/50",
    iconBg: "bg-violet-600",
    yearTag: "Years 5-9",
    tags: ["NSW", "VIC", "Reasoning"],
    href: "/lp/selective-school-test-prep",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Exams",
    description: "ACER, EduTest and school-specific scholarship preparation across reasoning and achievement.",
    accent: "border-t-amber-500 bg-amber-50/50",
    iconBg: "bg-amber-500",
    yearTag: "Years 4-10",
    tags: ["ACER", "EduTest"],
    href: "/lp/scholarship-exam-prep",
  },
  {
    icon: Microscope,
    title: "ICAS",
    description: "Higher-order English, maths and writing practice for students chasing deeper challenge.",
    accent: "border-t-emerald-500 bg-emerald-50/50",
    iconBg: "bg-emerald-600",
    yearTag: "Years 3-12",
    tags: ["English", "Maths", "Writing"],
    href: "/lp/icas-english-practice",
  },
  {
    icon: Award,
    title: "VCE/HSC",
    description: "Senior English skill pathways with structured practice and AI-supported feedback.",
    accent: "border-t-rose-500 bg-rose-50/50",
    iconBg: "bg-rose-600",
    yearTag: "Years 11-12",
    tags: ["English", "Analysis", "ATAR Prep"],
    href: "/lp/vce-english-exam-prep",
  },
  {
    icon: BookOpen,
    title: "NAPLAN",
    description: "Reading, writing, conventions and numeracy practice aligned to Australian expectations.",
    accent: "border-t-blue-500 bg-blue-50/45",
    iconBg: "bg-blue-600",
    yearTag: "Years 3-9",
    tags: ["Reading", "Writing", "Numeracy"],
    href: "/lp/naplan-practice-tests",
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
          <h2 className="text-display mb-6">Aim higher with the right exam pathway.</h2>
          <p className="text-lg text-muted-foreground">
            Start with selective entry, scholarships, ICAS and senior pathways, with NAPLAN still available when you need it.
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
                className={`group block h-full cursor-pointer rounded-[2rem] border border-t-4 border-border ${cat.accent} p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl`}
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] ${cat.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    <cat.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="rounded-full bg-background/85 px-3 py-1 text-xs font-black text-foreground shadow-sm">
                    {cat.yearTag}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">{cat.title}</h3>
                <p className="mb-6 text-base leading-relaxed text-muted-foreground">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-background/80 px-4 py-1.5 text-xs font-semibold text-foreground">
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
