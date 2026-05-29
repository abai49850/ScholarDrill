"use client";

import { type ReactNode } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

export function ProtectedPage({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  return <ProtectedRoute requireAdmin={requireAdmin}>{children}</ProtectedRoute>;
}
