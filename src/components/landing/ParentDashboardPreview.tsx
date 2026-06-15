import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, AlertCircle, Calendar } from "lucide-react";

export const ParentDashboardPreview = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display mb-6">Total visibility into your child's progress.</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              No more guessing if they're ready. Our Parent Dashboard provides crystal-clear insights into strengths, weaknesses, and overall exam readiness.
            </p>
            
            <div className="space-y-6">
              {[
                {
                  icon: <TrendingUp className="h-6 w-6 text-primary" />,
                  title: "Progress Analytics",
                  desc: "Track improvement over time across all subjects and difficulty levels."
                },
                {
                  icon: <Calendar className="h-6 w-6 text-success" />,
                  title: "Weekly Reports",
                  desc: "Get automated weekly summaries delivered straight to your inbox."
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6 text-subject-reading" />,
                  title: "Exam Readiness",
                  desc: "Clear percentage indicators showing how prepared they are for the real thing."
                },
                {
                  icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
                  title: "Skill Gap Analysis",
                  desc: "Instantly identify and target exactly which topics need more attention."
                }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                <div>
                  <h3 className="font-bold text-xl">Leo's Overview</h3>
                  <p className="text-sm text-muted-foreground">Year 5 NAPLAN Prep</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-success/20 text-success rounded-full text-xs font-bold">
                    On Track
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Exam Readiness</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-primary">85%</p>
                    <TrendingUp className="h-4 w-4 text-success mb-1.5" />
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Questions Done</p>
                  <p className="text-3xl font-bold">1,240</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Skill Breakdown</h4>
                <div className="space-y-4">
                  {[
                    { label: "Numeracy", result: "Band 8 (Strong)", width: "90%", bar: "bg-subject-maths", target: "Year 5 target: 70%" },
                    { label: "Reading", result: "Band 7 (Good)", width: "75%", bar: "bg-subject-reading", target: "Year 5 target: 70%" },
                    { label: "Writing", result: "Band 5 (Needs Work)", width: "45%", bar: "bg-orange-500", target: "Year 5 target: 70%", warn: true },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium flex items-center gap-1">
                          {item.label} {item.warn && <AlertCircle className="h-3 w-3 text-orange-500" />}
                        </span>
                        <span className={`font-medium ${item.warn ? "text-orange-500" : ""}`}>{item.result}</span>
                      </div>
                      <div className="relative h-3 w-full rounded-full bg-secondary">
                        <div className={`h-full rounded-full ${item.bar}`} style={{ width: item.width }} />
                        <div className="absolute left-[70%] top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-foreground/70" />
                      </div>
                      <div className="mt-1 text-right text-[11px] text-muted-foreground">{item.target}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
