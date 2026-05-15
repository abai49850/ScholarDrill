import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { GamifiedHeader } from "@/components/gamification/GamifiedHeader";
import { SeasonalBanner } from "@/components/gamification/SeasonalBanner";
import { DailyQuestsWidget } from "@/components/gamification/DailyQuestsWidget";
import { DailyCoachNudge } from "@/components/coach/DailyCoachNudge";
import { SubjectProgressCards } from "@/components/dashboard/SubjectProgressCards";
import { TestSelectionCards } from "@/components/dashboard/TestSelectionCards";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { ParentPortal } from "@/components/dashboard/ParentPortal";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, type UserStats } from "@/lib/statsApi";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";

export default function Dashboard() {
  const { profile } = useUserProfile();
  const { user, profile: dbProfile } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

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
                  Year {profile.yearLevel} · {profile.region}
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
                  <section>
                    <GamifiedHeader streak={stats.currentStreak} currentXp={stats.totalPoints} nextLevelXp={5000} level={Math.floor(stats.totalPoints / 500) + 1} />
                  </section>

                  <section>
                    <SeasonalBanner />
                  </section>

                  <section>
                    <DailyCoachNudge />
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
                        <DailyQuestsWidget />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold mb-4">Your Streaks</h2>
                        <StreakWidget stats={stats} dailyGoal={dbProfile?.daily_goal ?? 10} />
                      </div>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="parent-portal" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ParentPortal />
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
