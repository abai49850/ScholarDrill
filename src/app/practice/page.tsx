"use client";

import Practice from "@/views/Practice";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function Page() {
  return (
    <ProtectedPage>
      <Practice />
    </ProtectedPage>
  );
}
