import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type ExamFocus = "naplan" | "selective" | "scholarship" | "all";

export interface UserProfile {
  id: string;
  name: string;
  initial: string;
  yearLevel: number;
  region: string;
  examFocus: ExamFocus;
  isSuperUser?: boolean;
}

const FALLBACK: UserProfile = {
  id: "guest",
  name: "Guest",
  initial: "G",
  yearLevel: 5,
  region: "NSW",
  examFocus: "naplan",
};

interface Ctx {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  profiles: UserProfile[];
}

const UserProfileContext = createContext<Ctx | null>(null);

// Backwards-compat export (no longer used for personas, but kept to avoid breaking imports)
export const PRESET_PROFILES: UserProfile[] = [FALLBACK];

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { profile: dbProfile, isAdmin, user } = useAuth();
  const [override, setOverride] = useState<Partial<UserProfile> | null>(null);

  // Reset overrides when the signed-in user changes
  useEffect(() => { setOverride(null); }, [user?.id]);

  const profile: UserProfile = useMemo(() => {
    if (!dbProfile) return { ...FALLBACK, isSuperUser: isAdmin };
    const name = dbProfile.display_name || "Student";
    const base: UserProfile = {
      id: dbProfile.user_id,
      name,
      initial: name.charAt(0).toUpperCase(),
      yearLevel: dbProfile.year_level,
      region: dbProfile.region,
      examFocus: (dbProfile.exam_focus as ExamFocus) ?? "naplan",
      isSuperUser: isAdmin,
    };
    return { ...base, ...override };
  }, [dbProfile, isAdmin, override]);

  const value = useMemo<Ctx>(() => ({
    profile,
    setProfile: () => { /* no-op: profile derived from auth */ },
    updateProfile: (patch) => setOverride((o) => ({ ...(o ?? {}), ...patch })),
    profiles: [profile],
  }), [profile]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
