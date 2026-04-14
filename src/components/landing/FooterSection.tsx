import { Zap } from "lucide-react";

const footerLinks = {
  Tests: ["NAPLAN", "Selective Schools", "Scholarships", "Subject Practice"],
  States: ["NSW", "VIC", "QLD", "SA", "WA"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Refund Policy"],
};

export const FooterSection = () => {
  return (
    <footer className="border-t border-border bg-secondary/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AceIt</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              Australia's smartest test preparation platform.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AceIt. All rights reserved. Made in Australia 🇦🇺
        </div>
      </div>
    </footer>
  );
};
