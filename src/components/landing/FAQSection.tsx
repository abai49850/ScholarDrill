import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What tests does AceIt cover?",
    a: "AceIt covers NAPLAN (Years 3, 5, 7 & 9), selective school entry exams (NSW OC & Selective, VIC Selective Entry, QLD Academic Talent, WA ASET), and major scholarship tests including ACER and EduTest.",
  },
  {
    q: "How does the AI question generation work?",
    a: "Our AI engine generates fresh, curriculum-aligned questions tailored to your year level and ability. It adapts in real-time — getting harder when you're succeeding and providing scaffolding when you need support. Every question includes a detailed worked explanation.",
  },
  {
    q: "Is the content aligned with the Australian Curriculum?",
    a: "Yes! All content is aligned with the Australian Curriculum (v9). NAPLAN questions match official ACARA standards, and selective/scholarship content mirrors the style and difficulty of real exams.",
  },
  {
    q: "Can parents track their child's progress?",
    a: "Absolutely. Parents can link to their child's account to view progress reports, topic mastery breakdowns, and weekly performance summaries — all from a dedicated parent dashboard.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! The free plan gives you 10 questions per day, access to NAPLAN practice for Years 3 & 5, basic progress tracking, and instant explanations. Upgrade to Pro for unlimited access.",
  },
  {
    q: "What ages is AceIt suitable for?",
    a: "AceIt is designed for Australian students in Years 3–9, covering ages roughly 8–15. Content difficulty automatically adjusts based on the selected year level.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-display mb-4">Frequently asked questions</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mx-auto max-w-2xl"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
