import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SkillTree } from "@/components/gamification/SkillTree";
import { AchievementsVault } from "@/components/gamification/AchievementsVault";

export default function JourneyHub() {
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

            <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
              <div className="lg:col-span-2 h-full">
                <SkillTree />
              </div>
              <div className="h-full">
                <AchievementsVault />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
