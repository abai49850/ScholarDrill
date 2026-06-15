import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Loader2, Sparkles } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { GamifiedHeader } from "@/components/gamification/GamifiedHeader";
import { SeasonalBanner } from "@/components/gamification/SeasonalBanner";
import { DailyQuestsWidget } from "@/components/gamification/DailyQuestsWidget";
import { DailyCoachNudge } from "@/components/coach/DailyCoachNudge";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { SubjectProgressCards } from "@/components/dashboard/SubjectProgressCards";
import { TestSelectionCards } from "@/components/dashboard/TestSelectionCards";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { ParentPortal } from "@/components/dashboard/ParentPortal";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, type DailyQuest, type UserStats } from "@/lib/statsApi";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "@/lib/router";

import { getDisplayYear } from "@/lib/utils/australian-localiser";

export default function Dashboard() {
  const { profile } = useUserProfile();
  const { user, profile: dbProfile } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [bonusXp, setBonusXp] = useState(0);
  const [claimedQuestIds, setClaimedQuestIds] = useState<Set<string>>(new Set());
  const [eventClaimed, setEventClaimed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (!user) return;
    const key = `sd_rewards:${user.id}:${todayKey}`;
    const saved = JSON.parse(localStorage.getItem(key) || "{}") as {
      bonusXp?: number;
      quests?: string[];
      event?: boolean;
    };
    setBonusXp(saved.bonusXp ?? 0);
    setClaimedQuestIds(new Set(saved.quests ?? []));
    setEventClaimed(Boolean(saved.event));
  }, [todayKey, user]);

  const saveRewards = (next: { bonusXp: number; quests: Set<string>; event: boolean }) => {
    if (!user) return;
    localStorage.setItem(
      `sd_rewards:${user.id}:${todayKey}`,
      JSON.stringify({ bonusXp: next.bonusXp, quests: [...next.quests], event: next.event }),
    );
    setBonusXp(next.bonusXp);
    setClaimedQuestIds(next.quests);
    setEventClaimed(next.event);
  };

  const claimQuest = (quest: DailyQuest) => {
    if (claimedQuestIds.has(quest.id) || quest.progress < quest.target) return;
    const quests = new Set(claimedQuestIds);
    quests.add(quest.id);
    saveRewards({ bonusXp: bonusXp + quest.xp, quests, event: eventClaimed });
  };

  const claimEvent = () => {
    if (eventClaimed) return;
    saveRewards({ bonusXp: bonusXp + 150, quests: claimedQuestIds, event: true });
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    getUserStats(user.id, dbProfile?.daily_goal ?? 10)
      .then((s) => { if (!cancelled) setStats(s); })
      .finally(() => { if (!cancelled) setLoading(false); });

    // Realtime: refresh stats when this user records a new attempt
    const channel = supabase
      .channel(`attempts:${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "practice_attempts", filter: `user_id=eq.${user.id}` },
        () => { getUserStats(user.id, dbProfile?.daily_goal ?? 10).then(setStats); }
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [user, dbProfile?.daily_goal]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 glass-nav sticky top-0 z-40 justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="mr-3" />
              <div>
                <h1 className="text-base font-semibold">
                  Welcome back, {profile.name} 👋
                </h1>
                <p className="text-xs text-muted-foreground">
                  {getDisplayYear(profile.yearLevel, profile.region)} · {profile.region}
                  {profile.isSuperUser && " · Admin"}
                </p>
              </div>
            </div>
            {/* Show badge if parent/admin is viewing */}
            {profile.isSuperUser && (
              <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                Admin View
              </span>
            )}
          </header>

          <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
            {loading || !stats ? (
              <div className="flex items-center justify-center py-24 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading your stats…
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })} className="w-full">
                <div className="flex items-center justify-between mb-8">
                  <TabsList className="bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg px-6">Overview</TabsTrigger>
                    <TabsTrigger value="parent-portal" className="rounded-lg px-6">Parent Portal</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
                  {stats.totalAttempted === 0 ? (
                    <FirstSessionPrompt />
                  ) : (
                    <>
                  <section>
                    <GamifiedHeader streak={stats.currentStreak} currentXp={stats.totalPoints + bonusXp} nextLevelXp={5000} level={Math.floor((stats.totalPoints + bonusXp) / 500) + 1} />
                  </section>

                  <section>
                    <SeasonalBanner mathsToday={stats.mathsToday} claimed={eventClaimed} onClaim={claimEvent} />
                  </section>

                  <section>
                    <DailyCoachNudge />
                  </section>

                  <section>
                    <StatsOverview stats={{ ...stats, totalPoints: stats.totalPoints + bonusXp }} />
                  </section>

                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Subject Progress</h2>
                        <SubjectProgressCards stats={stats} />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold mb-4">Practice Tests</h2>
                        <TestSelectionCards />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <DailyQuestsWidget quests={stats.dailyQuests} claimedIds={claimedQuestIds} onClaim={claimQuest} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Your Streaks</h2>
                        <StreakWidget stats={stats} dailyGoal={dbProfile?.daily_goal ?? 10} />
                      </div>
                    </div>
                  </section>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="parent-portal" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ParentPortal stats={stats} profile={dbProfile} />
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function FirstSessionPrompt() {
  return (
    <section className="rounded-[2rem] border border-primary/20 bg-primary/10 p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            New dashboard
          </div>
          <h2 className="text-3xl font-black tracking-tight">Start one practice set to build your progress map.</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            After a few questions, ScholarDrill can show strengths, focus topics, streaks and parent-ready reports.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6 rounded-full">
            <Link to="/practice"><BookOpenCheck className="h-5 w-5" /> Start Free Practice</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Choose Maths, Reading, Writing or Reasoning"],
            ["2", "Answer a short adaptive set"],
            ["3", "Unlock your first recommendations"],
          ].map(([step, text]) => (
            <div key={step} className="rounded-2xl border border-border bg-background p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                {step}
              </div>
              <p className="text-sm font-semibold">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
