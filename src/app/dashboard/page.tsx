"use client";

import Dashboard from "@/views/Dashboard";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function Page() {
  return (
    <ProtectedPage>
      <Dashboard />
    </ProtectedPage>
  );
}
