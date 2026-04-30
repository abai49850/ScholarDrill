import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type ExamFocus = "naplan" | "selective" | "scholarship" | "all";

export interface UserProfile {
  id: string;
  name: string;
  initial: string;
  yearLevel: number; // 3, 5, 7, 9
  region: string; // NSW, VIC, QLD, etc.
  examFocus: ExamFocus;
  isSuperUser?: boolean;
}

export const PRESET_PROFILES: UserProfile[] = [
  {
    id: "super",
    name: "Super User",
    initial: "S",
    yearLevel: 5,
    region: "ALL",
    examFocus: "all",
    isSuperUser: true,
  },
  { id: "emma", name: "Emma W.", initial: "E", yearLevel: 5, region: "NSW", examFocus: "naplan" },
  { id: "liam-y3", name: "Liam (Y3)", initial: "L", yearLevel: 3, region: "VIC", examFocus: "naplan" },
  { id: "ava-y7", name: "Ava (Y7)", initial: "A", yearLevel: 7, region: "NSW", examFocus: "selective" },
  { id: "noah-y9", name: "Noah (Y9)", initial: "N", yearLevel: 9, region: "QLD", examFocus: "scholarship" },
];

const STORAGE_KEY = "aceit:activeProfile";

interface Ctx {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  profiles: UserProfile[];
}

const UserProfileContext = createContext<Ctx | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    if (typeof window === "undefined") return PRESET_PROFILES[0];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as UserProfile;
    } catch {/* ignore */}
    return PRESET_PROFILES[0];
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch {/* ignore */}
  }, [profile]);

  const value = useMemo<Ctx>(() => ({
    profile,
    setProfile: setProfileState,
    updateProfile: (patch) => setProfileState((p) => ({ ...p, ...patch })),
    profiles: PRESET_PROFILES,
  }), [profile]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
