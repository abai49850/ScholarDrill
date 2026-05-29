"use client";

import NaplanSimulator from "@/views/naplan/Simulator";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function Page() {
  return (
    <ProtectedPage>
      <NaplanSimulator />
    </ProtectedPage>
  );
}
