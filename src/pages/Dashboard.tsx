import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { SubjectProgressCards } from "@/components/dashboard/SubjectProgressCards";
import { TestSelectionCards } from "@/components/dashboard/TestSelectionCards";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { useUserProfile } from "@/contexts/UserProfileContext";

export default function Dashboard() {
  const { profile } = useUserProfile();
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
                {profile.isSuperUser && " · Super User"}
              </p>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-8 max-w-7xl">
            {/* Overview Stats */}
            <section>
              <StatsOverview />
            </section>

            {/* Two-column layout: Progress + Streak */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Subject Progress</h2>
                  <SubjectProgressCards />
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Practice Tests</h2>
                  <TestSelectionCards />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Your Streaks</h2>
                <StreakWidget />
              </div>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
