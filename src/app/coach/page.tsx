"use client";

import CoachPage from "@/views/coach/CoachPage";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function Page() {
  return (
    <ProtectedPage>
      <CoachPage />
    </ProtectedPage>
  );
}
