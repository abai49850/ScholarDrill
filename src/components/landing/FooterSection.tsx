
import { Link } from "react-router-dom";

const footerLinks: Record<string, { label: string; to: string }[]> = {
  Tests: [
    { label: "NAPLAN", to: "/practice" },
    { label: "Selective Schools", to: "/practice" },
    { label: "Scholarships", to: "/practice" },
    { label: "Subject Practice", to: "/practice" },
  ],
  States: [
    { label: "NSW", to: "/practice" },
    { label: "VIC", to: "/practice" },
    { label: "QLD", to: "/practice" },
    { label: "SA", to: "/practice" },
    { label: "WA", to: "/practice" },
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
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ScholarDrill Logo" className="h-9 w-9 object-contain" />
              <span className="text-xl font-bold text-foreground">ScholarDrill</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
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
          © {new Date().getFullYear()} ScholarDrill. All rights reserved. Made in Australia 🇦🇺
        </div>
      </div>
    </footer>
  );
};
