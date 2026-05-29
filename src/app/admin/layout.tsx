"use client";

import AdminLayout from "@/views/admin/AdminLayout";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage requireAdmin>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedPage>
  );
}
