import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  year_level: number;
  region: string;
  exam_focus: string;
  daily_goal: number;
  tier: "free" | "pro";
  is_blocked: boolean;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfileAndRole = useCallback(async (uid: string) => {
    const [{ data: prof }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    let resolvedProfile = (prof as Profile | null) ?? null;
    if (!resolvedProfile) {
      const currentUser = (await supabase.auth.getUser()).data.user;
      const metadata = currentUser?.user_metadata ?? {};
      const displayName =
        typeof metadata.display_name === "string"
          ? metadata.display_name
          : typeof metadata.full_name === "string"
            ? metadata.full_name
            : currentUser?.email?.split("@")[0] ?? "Student";
      const yearLevel =
        typeof metadata.year_level === "number"
          ? metadata.year_level
          : Number(metadata.year_level ?? 5);
      const { data: created } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: uid,
            display_name: displayName,
            year_level: Number.isFinite(yearLevel) ? yearLevel : 5,
            region: typeof metadata.region === "string" ? metadata.region : "NSW",
            exam_focus: typeof metadata.exam_focus === "string" ? metadata.exam_focus : "naplan",
          },
          { onConflict: "user_id" },
        )
        .select("*")
        .maybeSingle();
      resolvedProfile = (created as Profile | null) ?? null;
    }
    setProfile(resolvedProfile);
    setIsAdmin(!!roles?.some((r: { role: string }) => r.role === "admin"));
  }, []);

  useEffect(() => {
    // 1) Listener first (avoid deadlocks: defer Supabase calls)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => { loadProfileAndRole(sess.user.id); }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    // 2) Then existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) loadProfileAndRole(sess.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfileAndRole]);

  const refreshProfile = async () => {
    if (user) await loadProfileAndRole(user.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <Ctx.Provider value={{ user, session, profile, isAdmin, loading, refreshProfile, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
