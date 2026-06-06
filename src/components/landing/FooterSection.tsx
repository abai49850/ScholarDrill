import { Link } from "@/lib/router";

const footerLinks: Record<string, { label: string; to: string }[]> = {
  Tests: [
    { label: "NAPLAN", to: "/lp/naplan-practice-tests" },
    { label: "Selective Schools", to: "/lp/selective-school-test-prep" },
    { label: "Scholarships", to: "/lp/scholarship-exam-prep" },
    { label: "Subject Practice", to: "/lp/year-5-maths-practice" },
  ],
  States: [
    { label: "NSW", to: "/lp/selective-school-test-prep" },
    { label: "VIC", to: "/lp/vic-selective-entry-prep" },
    { label: "QLD", to: "/lp/selective-school-test-prep" },
    { label: "SA", to: "/lp/scholarship-exam-prep" },
    { label: "WA", to: "/lp/scholarship-exam-prep" },
  ],
  Company: [
    { label: "About", to: "/info/about" },
    { label: "Blog", to: "/info/blog" },
    { label: "Careers", to: "/info/careers" },
    { label: "Contact", to: "/info/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/info/privacy" },
    { label: "Terms of Service", to: "/info/terms" },
    { label: "Refund Policy", to: "/info/refund" },
  ],
};

export const FooterSection = () => {
  return (
    <footer className="border-t border-border bg-secondary/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center bg-slate-900 rounded-xl px-2 py-1 shadow-sm">
              <img src="/logo.png" alt="ScholarDrill Logo" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
            <p className="mt-8 text-sm text-muted-foreground">
              Australia's smartest test preparation platform.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          Copyright {new Date().getFullYear()} ScholarDrill. All rights reserved. Made in Australia.
        </div>
      </div>
    </footer>
  );
};
