import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with essential practice",
    features: [
      "10 questions per day",
      "NAPLAN practice (Year 3 & 5)",
      "Basic progress tracking",
      "Instant answer explanations",
    ],
    cta: "Start Free",
    variant: "hero-outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$14.99",
    period: "/month",
    description: "Unlimited practice for serious students",
    features: [
      "Unlimited questions",
      "All test types & year levels",
      "AI adaptive difficulty",
      "Detailed analytics & reports",
      "Parent dashboard access",
      "Timed test simulations",
    ],
    cta: "Start 7-day free trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Family",
    price: "$24.99",
    period: "/month",
    description: "For families with multiple students",
    features: [
      "Everything in Pro",
      "Up to 4 student profiles",
      "Family progress overview",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start 7-day free trial",
    variant: "hero-outline" as const,
    popular: false,
  },
];

export const PricingSection = () => {
  const { user } = useAuth();
  const ctaTo = (planName: string) =>
    planName === "Free" ? (user ? "/practice" : "/auth") : user ? "/dashboard" : "/auth";
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-display mb-4">Simple, honest pricing.</h2>
          <p className="text-lg text-muted-foreground">
            No contracts. Cancel anytime. Start free and upgrade when you're ready.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-primary bg-card shadow-lg scale-[1.02]"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <Button variant={plan.variant} className="mt-6 w-full" asChild>
                <Link to={ctaTo(plan.name)}>{plan.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
