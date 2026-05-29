"use client";

import JourneyHub from "@/views/gamification/JourneyHub";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function Page() {
  return (
    <ProtectedPage>
      <JourneyHub />
    </ProtectedPage>
  );
}
