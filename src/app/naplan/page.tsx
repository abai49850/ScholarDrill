"use client";

import NaplanHub from "@/views/naplan/Index";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function Page() {
  return (
    <ProtectedPage>
      <NaplanHub />
    </ProtectedPage>
  );
}
