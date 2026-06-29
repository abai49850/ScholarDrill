import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Selective", href: "/lp/selective-school-test-prep" },
  { label: "Scholarships", href: "/lp/scholarship-exam-prep" },
  { label: "ICAS", href: "/lp/icas-english-practice" },
  { label: "VCE", href: "/lp/vce-english-exam-prep" },
  { label: "NAPLAN", href: "/lp/naplan-practice-tests" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="#" className="flex items-center overflow-hidden rounded-xl shadow-sm transition-transform hover:scale-105">
          <img src="/logo.png" alt="ScholarEdge Logo" className="h-9 w-auto object-contain md:h-11" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button variant="hero" size="sm" asChild><Link to="/dashboard">Open Dashboard</Link></Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/auth">Log in</Link></Button>
              <Button variant="hero" size="sm" asChild><Link to="/auth">Start Free</Link></Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full md:hidden hover:bg-secondary transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-nav border-t border-border md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {user ? (
                  <Button variant="hero" asChild><Link to="/dashboard">Open Dashboard</Link></Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild><Link to="/auth">Log in</Link></Button>
                    <Button variant="hero" asChild><Link to="/auth">Start Free</Link></Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
