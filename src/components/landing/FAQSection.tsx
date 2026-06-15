import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What tests does ScholarDrill cover?",
    a: "ScholarDrill covers NAPLAN Years 3, 5, 7 and 9, ICAS, selective school entry exams across NSW and VIC, scholarship tests including ACER and EduTest, plus senior English skill pathways for VCE and HSC preparation.",
  },
  {
    q: "What has changed in the expanded practice library?",
    a: "The practice library now includes richer exam pathways for ICAS, VIC Selective Entry, NSW selective entry, ACER scholarships, EduTest, VCE and HSC-style skills. Each pathway has its own exam structure, timing guidance and subject mix, so students are not pushed through one generic question set.",
  },
  {
    q: "How does the AI question generation work?",
    a: "The AI engine generates fresh, curriculum-aligned questions tailored to the student's year level, target exam and ability. It adapts in real time, becoming more challenging when students are succeeding and adding scaffolding when they need support. Every question includes a worked explanation.",
  },
  {
    q: "What does the AI tutor actually do?",
    a: "The AI tutor reads recent practice history, strengths, weak topics and accuracy patterns, then gives targeted guidance instead of generic study advice. It can explain mistakes, recommend the next topic, and help students turn dashboard data into a practical study plan.",
  },
  {
    q: "What makes ScholarDrill different from static worksheets or past papers?",
    a: "ScholarDrill combines adaptive practice, daily quests, XP motivation, parent reporting, tutor sharing and AI coaching in one web app. Students get instant explanations, parents can see progress clearly, and tutors can receive focused reports instead of guessing what happened between lessons.",
  },
  {
    q: "Is the content aligned with the Australian Curriculum?",
    a: "Yes. Core learning content is aligned with the Australian Curriculum v9. NAPLAN questions follow ACARA-style domains, while selective and scholarship content is designed around the structure and difficulty of the relevant entrance exams.",
  },
  {
    q: "Can parents track their child's progress?",
    a: "Absolutely. Parents can view progress reports, topic mastery breakdowns, weekly performance summaries, tutor-share options and downloadable reports from the parent dashboard.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Students can start with a free diagnostic test and daily practice access, including instant explanations and basic progress tracking. Pro unlocks broader exam coverage, deeper analytics and more practice volume.",
  },
  {
    q: "What ages is ScholarDrill suitable for?",
    a: "ScholarDrill is designed for Australian students from upper primary through senior secondary pathways. Most practice starts from Years 3-9, with dedicated ICAS, scholarship, selective, VCE and HSC-style pathways extending the coverage further.",
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
          <p className="text-sm text-muted-foreground">Tap any question to expand the answer.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mx-auto max-w-2xl"
        >
          <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3">
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
