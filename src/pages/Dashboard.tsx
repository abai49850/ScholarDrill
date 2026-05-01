import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { SubjectProgressCards } from "@/components/dashboard/SubjectProgressCards";
import { TestSelectionCards } from "@/components/dashboard/TestSelectionCards";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, type UserStats } from "@/lib/statsApi";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { profile } = useUserProfile();
  const { user, profile: dbProfile } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

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
          <header className="h-14 flex items-center border-b border-border px-4 glass-nav sticky top-0 z-40">
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
          </header>

          <main className="flex-1 p-6 space-y-8 max-w-7xl">
            {loading || !stats ? (
              <div className="flex items-center justify-center py-24 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading your stats…
              </div>
            ) : (
              <>
                <section>
                  <StatsOverview stats={stats} />
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

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Your Streaks</h2>
                    <StreakWidget stats={stats} dailyGoal={dbProfile?.daily_goal ?? 10} />
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
