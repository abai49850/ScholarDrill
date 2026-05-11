import { supabase } from "@/integrations/supabase/client";

export interface AdminUserRow {
  user_id: string;
  email: string | null;
  display_name: string;
  year_level: number;
  region: string;
  tier: "free" | "pro";
  is_blocked: boolean;
  is_admin: boolean;
  created_at: string;
  attempts_count: number;
  last_active: string | null;
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const { data, error } = await supabase.rpc.call(supabase, "admin_list_users");
  if (error) throw error;
  return (data ?? []) as unknown as AdminUserRow[];
}

export async function setUserTier(userId: string, tier: "free" | "pro") {
  const { error } = await supabase.from("profiles").update({ tier }).eq("user_id", userId);
  if (error) throw error;
}

export async function setUserBlocked(userId: string, isBlocked: boolean) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_blocked: isBlocked })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function setUserAdmin(userId: string, makeAdmin: boolean) {
  const { error } = await supabase.rpc.call(supabase, "admin_set_admin", {
    _user_id: userId,
    _make_admin: makeAdmin,
  });
  if (error) throw error;
}

export async function sendUserPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?mode=reset`,
  });
  if (error) throw error;
}
