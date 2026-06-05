import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SkillTree } from "@/components/gamification/SkillTree";
import { AchievementsVault } from "@/components/gamification/AchievementsVault";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, type UserStats } from "@/lib/statsApi";
import { supabase } from "@/integrations/supabase/client";

export default function JourneyHub() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserStats(user.id, profile?.daily_goal ?? 10).then(setStats);
    const channel = supabase
      .channel(`journey-attempts:${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "practice_attempts", filter: `user_id=eq.${user.id}` },
        () => getUserStats(user.id, profile?.daily_goal ?? 10).then(setStats),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile?.daily_goal, user]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/10">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 glass-nav sticky top-0 z-40">
            <SidebarTrigger className="mr-3" />
            <h1 className="text-base font-semibold">Your Journey & Rewards</h1>
          </header>
          
          <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
            <div className="mb-4">
              <h1 className="text-3xl font-black tracking-tight text-foreground">Explore Your Journey</h1>
              <p className="text-muted-foreground font-medium">Unlock modules, earn badges, and level up!</p>
            </div>

            {!stats ? (
              <div className="flex items-center justify-center py-24 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading your journey...
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
                <div className="lg:col-span-2 h-full">
                  <SkillTree stats={stats} />
                </div>
                <div className="h-full">
                  <AchievementsVault stats={stats} />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
