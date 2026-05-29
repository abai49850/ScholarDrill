import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TutorOnboarding } from "@/components/coach/TutorOnboarding";
import { ChatInterface } from "@/components/coach/ChatInterface";
import type { TutorPersonality } from "@/data/tutors";

export default function CoachPage() {
  const [tutor, setTutor] = useState<TutorPersonality | null>(null);
  const [goals, setGoals] = useState<string[]>([]);

  const handleOnboardingComplete = (t: TutorPersonality, g: string[]) => {
    setTutor(t);
    setGoals(g);
  };

  const handleChangeTutor = () => {
    setTutor(null);
    setGoals([]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 flex items-center border-b border-border px-4 glass-nav sticky top-0 z-40 shrink-0">
            <SidebarTrigger className="mr-3" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h1 className="text-base font-semibold">AI Study Coach</h1>
            </div>
            {tutor && (
              <span className={`ml-3 text-xs font-bold px-3 py-1 rounded-full ${tutor.bgClass} ${tutor.textClass} border ${tutor.borderClass}`}>
                {tutor.emoji} Chatting with {tutor.name}
              </span>
            )}
          </header>

          <div className="flex-1 overflow-hidden">
            {!tutor ? (
              <div className="h-full overflow-y-auto">
                <TutorOnboarding onComplete={handleOnboardingComplete} />
              </div>
            ) : (
              <div className="h-full flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
                <ChatInterface
                  tutor={tutor}
                  goals={goals}
                  onChangeTutor={handleChangeTutor}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
