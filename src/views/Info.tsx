import { Navbar } from "@/components/landing/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { useParams, Navigate, Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Section = { heading?: string; body: string };
type Doc = { title: string; subtitle?: string; updated?: string; sections: Section[] };

const docs: Record<string, Doc> = {
  about: {
    title: "About ScholarEdge",
    subtitle: "Australia's smartest test preparation platform.",
    sections: [
      { heading: "Our mission", body: "We believe every Australian student deserves access to world-class, affordable test preparation. ScholarEdge combines AI-generated, curriculum-aligned questions with adaptive difficulty so students can practise smarter — not just harder." },
      { heading: "What we cover", body: "NAPLAN (Years 3, 5, 7 and 9), selective school entry exams across NSW, VIC, QLD and WA, and major scholarship tests including ACER and EduTest." },
      { heading: "Built in Australia", body: "ScholarEdge is designed and built in Australia by a small team of educators and engineers, with content aligned to the Australian Curriculum (v9) and ACARA standards." },
    ],
  },
  blog: {
    title: "ScholarEdge Blog",
    subtitle: "Tips, study guides and updates from the ScholarEdge team.",
    sections: [
      { heading: "Coming soon", body: "We're putting together study guides, parent resources and product updates. Subscribe via the contact page to be notified when new posts are published." },
      { heading: "Topics we'll cover", body: "NAPLAN preparation strategies, selective school exam tips, scholarship test breakdowns, how to use AI for revision, and parent guides for supporting your child's study at home." },
    ],
  },
  careers: {
    title: "Careers at ScholarEdge",
    subtitle: "Help us shape the future of education in Australia.",
    sections: [
      { heading: "Why ScholarEdge", body: "We're a small, focused team building tools that meaningfully improve outcomes for Australian students. We work remotely across Australia with quarterly in-person meetups." },
      { heading: "Open roles", body: "We don't have any open roles right now, but we're always keen to hear from talented educators, content writers, and engineers. Send us a note via the contact page." },
      { heading: "What we value", body: "Curiosity, craft, and care for students. We move quickly, ship often, and trust each other to do great work." },
    ],
  },
  contact: {
    title: "Contact ScholarEdge",
    subtitle: "We'd love to hear from you.",
    sections: [
      { heading: "Support", body: "For help with your account, billing, or technical issues, email support@scholaredge.com.au and we'll get back to you within one business day." },
      { heading: "Schools & partnerships", body: "Interested in bringing ScholarEdge to your school or tutoring group? Email partnerships@scholaredge.com.au." },
      { heading: "Press & media", body: "For press enquiries, contact press@scholaredge.com.au." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: May 2026",
    sections: [
      { heading: "Overview", body: "ScholarEdge respects your privacy. This policy explains what information we collect, how we use it, and the choices you have. We comply with the Australian Privacy Principles under the Privacy Act 1988 (Cth)." },
      { heading: "Information we collect", body: "Account details (name, email, year level, region), practice activity (questions attempted, results, time spent), and basic device/usage information needed to operate the service." },
      { heading: "How we use it", body: "To deliver and improve practice sessions, personalise difficulty, generate progress reports, and communicate important account or product updates. We do not sell personal information." },
      { heading: "Children", body: "Many of our users are under 16. Accounts for minors should be set up with a parent or guardian, who is responsible for the account. We collect only what we need to deliver the service." },
      { heading: "Data security", body: "Data is stored on secure cloud infrastructure with encryption in transit and at rest. Access is restricted to authorised personnel." },
      { heading: "Your rights", body: "You can request access to or deletion of your personal data at any time by emailing privacy@scholaredge.com.au." },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "Last updated: May 2026",
    sections: [
      { heading: "Acceptance", body: "By creating an account or using ScholarEdge, you agree to these Terms of Service. If you are under 18, a parent or guardian must agree on your behalf." },
      { heading: "Your account", body: "You are responsible for keeping your login details secure and for activity on your account. Don't share your account with others." },
      { heading: "Acceptable use", body: "Use ScholarEdge for personal study only. Don't attempt to scrape questions, reverse engineer the service, or use it to harass other users." },
      { heading: "Content", body: "Practice questions are inspired by publicly available curricula and exam frameworks. AI-generated questions are produced for personal study; you may not redistribute them commercially." },
      { heading: "Subscriptions", body: "Paid plans renew automatically until cancelled. You can cancel any time from your account settings; cancellation takes effect at the end of the current billing period." },
      { heading: "Disclaimer", body: "ScholarEdge is a study tool. We don't guarantee any particular exam outcome. Always cross-check critical information with official exam authorities." },
    ],
  },
  refund: {
    title: "Refund Policy",
    updated: "Last updated: May 2026",
    sections: [
      { heading: "Free trial", body: "Pro and Family plans include a 7-day free trial. You can cancel any time during the trial and you won't be charged." },
      { heading: "Monthly subscriptions", body: "Monthly subscriptions are non-refundable once the billing period has started. You can cancel future renewals from your account settings at any time." },
      { heading: "Annual subscriptions", body: "Annual plans are eligible for a pro-rated refund within the first 30 days. After 30 days, annual plans are non-refundable but remain active until the end of the term." },
      { heading: "How to request a refund", body: "Email billing@scholaredge.com.au with your account email and the reason for your request. We aim to respond within two business days." },
      { heading: "Australian Consumer Law", body: "Nothing in this policy limits your rights under the Australian Consumer Law." },
    ],
  },
  pricing: {
    title: "Pricing",
    subtitle: "Simple plans for Australian students and families.",
    updated: "Last updated: May 2026",
    sections: [
      { heading: "Free", body: "The Free plan includes one curated practice session per day, basic progress tracking, and instant explanations." },
      { heading: "Pro", body: "The Pro plan includes unlimited questions, adaptive difficulty, detailed analytics, timed simulations, and parent dashboard access." },
      { heading: "Family", body: "The Family plan includes Pro features for up to four student profiles, family progress summaries, priority support, and early access to new features." },
      { heading: "Trials and cancellations", body: "Paid plans include a 7-day free trial. You can cancel future renewals at any time from your account settings." },
    ],
  },
};

const Info = () => {
  const { slug } = useParams();
  const doc = slug ? docs[slug] : undefined;
  if (!doc) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="container mx-auto max-w-3xl px-6 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{doc.title}</h1>
        {doc.subtitle && <p className="mt-4 text-lg text-muted-foreground">{doc.subtitle}</p>}
        {doc.updated && <p className="mt-2 text-sm text-muted-foreground">{doc.updated}</p>}

        <div className="mt-12 space-y-10">
          {doc.sections.map((s, i) => (
            <div key={i}>
              {s.heading && <h2 className="text-xl font-semibold text-foreground mb-3">{s.heading}</h2>}
              <p className="text-base leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-3">
          <Button variant="hero" asChild>
            <Link to="/practice">
              Start practising
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="hero-outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </section>
      <FooterSection />
    </main>
  );
};

export default Info;
