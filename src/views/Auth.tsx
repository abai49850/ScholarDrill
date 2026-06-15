import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router";
import { motion } from "framer-motion";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const YEARS = [3, 5, 7, 9];
const REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const FOCI = [
  { value: "selective", label: "Selective" },
  { value: "scholarship", label: "Scholarship" },
  { value: "naplan", label: "NAPLAN" },
];

function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("Failed to fetch")) {
    return "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env, then restart the dev server.";
  }
  return message.includes("Invalid") ? "Invalid email or password." : message;
}

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromParam = new URLSearchParams(location.search).get("from");
  const redirectTo = fromParam || "/dashboard";
  const isResetLink =
    location.search.includes("mode=reset") ||
    location.search.includes("type=recovery") ||
    location.hash.includes("type=recovery");

  const [resetMode, setResetMode] = useState(isResetLink);

  useEffect(() => {
    if (!loading && user && !resetMode) navigate(redirectTo, { replace: true });
  }, [user, loading, navigate, redirectTo, resetMode]);

  useEffect(() => {
    if (isResetLink) setResetMode(true);
  }, [isResetLink]);

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes("type=recovery") || search.includes("type=recovery") || search.includes("mode=reset")) {
      setResetMode(true);
    }

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setResetMode(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Sign in
  const [siEmail, setSiEmail] = useState("");
  const [siPwd, setSiPwd] = useState("");
  const [siBusy, setSiBusy] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetBusy, setResetBusy] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [newPwdConfirm, setNewPwdConfirm] = useState("");
  const [updateBusy, setUpdateBusy] = useState(false);

  // Sign up
  const [name, setName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPwd, setSuPwd] = useState("");
  const [year, setYear] = useState("5");
  const [region, setRegion] = useState("NSW");
  const [focus, setFocus] = useState("selective");
  const [suBusy, setSuBusy] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPwd });
      if (error) {
        toast.error(getAuthErrorMessage(error));
        return;
      }
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSiBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: suEmail,
        password: suPwd,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            display_name: name,
            year_level: Number(year),
            region,
            exam_focus: focus,
          },
        },
      });
      if (error) {
        toast.error(getAuthErrorMessage(error));
        return;
      }
      if (data.session) {
        toast.success("Account created. Welcome to ScholarDrill.");
        navigate("/dashboard", { replace: true });
      } else {
        toast.success("Account created. Check your email to confirm your account.");
      }
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSuBusy(false);
    }
  };

  const handlePasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (resetEmail || siEmail).trim();
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    setResetBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      if (error) {
        toast.error(getAuthErrorMessage(error));
        return;
      }
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setResetBusy(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (newPwd !== newPwdConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setUpdateBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) {
        toast.error(getAuthErrorMessage(error));
        return;
      }
      toast.success("Password updated.");
      setResetMode(false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setUpdateBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center bg-slate-900 rounded-xl px-3 py-2 shadow-sm transition-transform hover:scale-105">
            <img src="/logo.png" alt="ScholarDrill Logo" className="h-12 md:h-14 w-auto object-contain" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          {resetMode ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-xl font-bold">Set a new password</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a new password for your ScholarDrill account.
                </p>
              </div>
              <div>
                <Label htmlFor="new-pwd">New password</Label>
                <Input
                  id="new-pwd"
                  type="password"
                  required
                  minLength={8}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label htmlFor="new-pwd-confirm">Confirm password</Label>
                <Input
                  id="new-pwd-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={newPwdConfirm}
                  onChange={(e) => setNewPwdConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={updateBusy}>
                {updateBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setResetMode(false)}>
                Back to sign in
              </Button>
            </form>
          ) : (
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" required value={siEmail} onChange={(e) => setSiEmail(e.target.value)} autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="si-pwd">Password</Label>
                  <Input id="si-pwd" type="password" required value={siPwd} onChange={(e) => setSiPwd(e.target.value)} autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full" disabled={siBusy}>
                  {siBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
              <form onSubmit={handlePasswordRequest} className="mt-4 rounded-xl border border-border p-3 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Request password change
                </div>
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                />
                <Button type="submit" variant="outline" size="sm" className="w-full" disabled={resetBusy}>
                  {resetBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset email"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Smith" />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" required value={suEmail} onChange={(e) => setSuEmail(e.target.value)} autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="su-pwd">Password</Label>
                  <Input id="su-pwd" type="password" required minLength={8} value={suPwd} onChange={(e) => setSuPwd(e.target.value)} autoComplete="new-password" />
                  <p className="text-[11px] text-muted-foreground mt-1">Min 8 characters. Checked against breach database.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Year level</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {YEARS.map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Exam focus</Label>
                  <Select value={focus} onValueChange={setFocus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FOCI.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={suBusy}>
                  {suBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By continuing you agree to ScholarDrill's terms. <Link to="/" className="underline">Back to home</Link>
        </p>
      </motion.div>
    </main>
  );
}
