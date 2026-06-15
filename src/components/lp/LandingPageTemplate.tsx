import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/router";
import { CheckCircle2, Star, ChevronDown, ArrowRight, Play, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingPageData } from "@/data/landingPages";
import { Navbar } from "@/components/landing/Navbar";

const accentMap: Record<string, string> = {
  blue: "from-blue-600 to-indigo-600",
  amber: "from-amber-500 to-orange-600",
  violet: "from-violet-600 to-purple-700",
  green: "from-emerald-500 to-teal-600",
  rose: "from-rose-500 to-pink-600",
  indigo: "from-indigo-600 to-blue-700",
};

const accentBgMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  amber: "bg-amber-50 border-amber-200 text-amber-700",
  violet: "bg-violet-50 border-violet-200 text-violet-700",
  green: "bg-emerald-50 border-emerald-200 text-emerald-700",
  rose: "bg-rose-50 border-rose-200 text-rose-700",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-foreground pr-4">{q}</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InteractiveDemo({ question }: { question: LandingPageData["sampleQuestion"] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6 md:p-8 shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">
        <Play className="h-4 w-4" /> Live Sample Question
      </div>
      <p className="text-lg font-semibold text-foreground mb-6 leading-relaxed">{question.text}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = selected === i;
          let cls = "text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ";
          if (!answered) cls += "border-border bg-background hover:border-primary/50 cursor-pointer";
          else if (isCorrect) cls += "border-success bg-success/10 text-success";
          else if (isSelected) cls += "border-destructive bg-destructive/10 text-destructive";
          else cls += "border-border bg-muted/30 text-muted-foreground";
          return (
            <button key={i} onClick={() => !answered && setSelected(i)} className={cls}>
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 flex items-center gap-2 p-4 rounded-xl text-sm font-semibold ${selected === question.correctIndex ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {selected === question.correctIndex ? "Correct! Great work." : `Not quite. The correct answer is ${String.fromCharCode(65 + question.correctIndex)}.`}
          {answered && <button onClick={() => setSelected(null)} className="ml-auto underline text-xs opacity-70">Try again</button>}
        </motion.div>
      )}
    </div>
  );
}

export function LandingPageTemplate({ data }: { data: LandingPageData }) {
  const gradient = accentMap[data.accentColor] || accentMap.blue;
  const accentBg = accentBgMap[data.accentColor] || accentBgMap.blue;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-6 ${accentBg}`}>
              {data.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight mb-6">
              {data.headline}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
              {data.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className={`h-14 px-10 text-lg rounded-full bg-gradient-to-r ${gradient} text-white border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all`} asChild>
                <Link to="/auth">{data.primaryCta} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
                <Play className="mr-2 h-5 w-5" /> Try a Sample Question
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">✓ No credit card required &nbsp;·&nbsp; ✓ Free diagnostic included &nbsp;·&nbsp; ✓ Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-foreground text-background py-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-sm font-medium text-background/60 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl flex flex-wrap justify-center gap-8 text-sm font-semibold text-muted-foreground">
          {["🇦🇺 Australian Curriculum Aligned", "🔒 Safe & Trusted by 12,000+ Families", "⚡ AI-Powered Personalisation", "📊 Real-Time Progress Tracking"].map((t, i) => (
            <span key={i} className="flex items-center gap-2">{t}</span>
          ))}
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">Try It Right Now — No Sign Up Needed</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Answer a real sample question and experience the ScholarDrill difference.</p>
          </div>
          <InteractiveDemo question={data.sampleQuestion} />
          <div className="text-center mt-8">
            <Button size="lg" className={`rounded-full px-10 h-14 text-lg bg-gradient-to-r ${gradient} text-white border-0 shadow-md`} asChild>
              <Link to="/auth">Get 50 More Questions Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-4">Everything Your Child Needs to Succeed</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A complete preparation system — not just a question bank.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS PREVIEW WIDGET */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-6 ${accentBg}`}>📊 Parent Dashboard</span>
            <h2 className="text-3xl font-black mb-4">See Exactly How Your Child Is Progressing</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">The ScholarDrill Parent Portal gives you a real-time window into your child's performance — no guesswork, no waiting for school reports.</p>
            <ul className="space-y-3">
              {["Predicted exam scores updated after every session", "Weekly improvement trend charts", "AI-generated study recommendations", "Side-by-side comparison vs. national benchmarks"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
          </div>
          {/* Mini dashboard mockup */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-sm">Progress Overview</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">This Week</span>
            </div>
            <div className="space-y-4">
              {[["Numeracy", 88, "text-success"], ["Reading", 74, "text-primary"], ["Writing", 65, "text-orange-500"], ["Conventions", 51, "text-rose-500"]].map(([label, pct, color]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{label}</span><span className={color as string}>{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${color === "text-success" ? "bg-success" : color === "text-primary" ? "bg-primary" : color === "text-orange-500" ? "bg-orange-500" : "bg-rose-500"}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-black text-foreground">14</p>
                <p className="text-xs text-muted-foreground font-medium">Day Streak 🔥</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-foreground">4,250</p>
                <p className="text-xs text-muted-foreground font-medium">XP Earned ⭐</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-success">Band 7</p>
                <p className="text-xs text-muted-foreground font-medium">Predicted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-4">Trusted by Thousands of Australian Families</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
              {Array(5).fill(0).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
              <span className="ml-2 text-foreground font-bold">4.9/5</span>
              <span className="text-muted-foreground font-medium ml-1">from 2,400+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`} alt={t.name} className="w-12 h-12 rounded-full border-2 border-border bg-muted" />
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                  <div className="ml-auto flex text-yellow-500">
                    {Array(t.rating).fill(0).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} defaultOpen={i === 0} />)}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={`py-20 bg-gradient-to-r ${gradient} text-white`}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="flex justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-white/70" />
            <Zap className="h-6 w-6 text-white/70" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Start Your Child's Free Diagnostic Test Today</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Join 12,000+ Australian families already using ScholarDrill. No credit card required. Results in minutes.</p>
          <Button size="lg" className="h-14 px-12 text-lg rounded-full bg-white text-foreground hover:bg-white/90 shadow-xl font-bold" asChild>
            <Link to="/auth">{data.primaryCta} <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <p className="mt-4 text-sm text-white/60">Free forever plan available · Upgrade anytime · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-10 text-center text-sm">
        <p className="text-background/50">© {new Date().getFullYear()} ScholarDrill · Australian Curriculum Aligned · <Link to="/" className="underline hover:text-white transition-colors">Home</Link></p>
      </footer>
    </div>
  );
}
