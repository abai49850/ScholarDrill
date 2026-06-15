import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ParentPortal } from "@/components/dashboard/ParentPortal";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, type UserStats } from "@/lib/statsApi";
import { supabase } from "@/integrations/supabase/client";
import { getDisplayYear } from "@/lib/utils/australian-localiser";

export default function ParentDashboard() {
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

    const channel = supabase
      .channel(`parent-attempts:${user.id}`)
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
                <h1 className="text-base font-semibold">Parent Portal</h1>
                <p className="text-xs text-muted-foreground">
                  {profile.name} - {getDisplayYear(profile.yearLevel, profile.region)} - {profile.region}
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {loading || !stats ? (
              <div className="flex items-center justify-center py-24 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading parent insights...
              </div>
            ) : (
              <ParentPortal stats={stats} profile={dbProfile} userId={user?.id} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
