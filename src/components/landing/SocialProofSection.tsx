import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "ScholarDrill has completely transformed how my son approaches NAPLAN. He went from being anxious to actually enjoying the practice sessions. The analytics showed me exactly where he needed help.",
    author: "Sarah Jenkins",
    role: "Parent of Year 5 Student",
    type: "Parent",
  },
  {
    quote: "As an educator, I'm incredibly impressed by the quality of the AI-generated questions. They align perfectly with the Australian Curriculum and provide exactly the right level of challenge.",
    author: "David Thompson",
    role: "Primary School Teacher, VIC",
    type: "Teacher",
  },
  {
    quote: "The streak system is brilliant! My daughter logs in every day just to keep her streak alive. She just got accepted into her first preference selective school and we couldn't be happier.",
    author: "Michelle Lee",
    role: "Parent of Year 8 Student",
    type: "Parent",
  },
];

export const SocialProofSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display mb-6">Trusted by parents. Loved by students.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Australian families who have already discovered the smartest way to prepare for exams.
          </p>
        </motion.div>

        {/* Success Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto border-y border-border py-10">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">95%</p>
            <p className="text-sm font-medium text-muted-foreground">Improved NAPLAN Bands</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-success mb-2">10k+</p>
            <p className="text-sm font-medium text-muted-foreground">Active Students</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-500 mb-2">4.9/5</p>
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-subject-reading mb-2">2M+</p>
            <p className="text-sm font-medium text-muted-foreground">Questions Answered</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm relative"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-8 italic">"{t.quote}"</p>
              <div className="mt-auto">
                <p className="font-bold text-foreground">{t.author}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
              
              {/* Type Badge */}
              <div className="absolute top-8 right-8 text-xs font-bold uppercase tracking-wider text-muted-foreground/50">
                {t.type}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
