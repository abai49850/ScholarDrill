import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteUser,
  listAdminUsers,
  sendUserPasswordReset,
  setUserAdmin,
  setUserBlocked,
  setUserTier,
  type AdminUserRow,
} from "@/lib/usersApi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { KeyRound, Search, ShieldCheck, Crown, UserX, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState<AdminUserRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "pro">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [busy, setBusy] = useState<string | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setRows(null);
    try {
      setRows(await listAdminUsers());
    } catch (e) {
      toast({ title: "Failed to load users", description: (e as Error).message, variant: "destructive" });
      setRows([]);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const s = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (tierFilter !== "all" && r.tier !== tierFilter) return false;
      if (statusFilter === "active" && r.is_blocked) return false;
      if (statusFilter === "blocked" && !r.is_blocked) return false;
      if (!s) return true;
      return (
        (r.email ?? "").toLowerCase().includes(s) ||
        (r.display_name ?? "").toLowerCase().includes(s)
      );
    });
  }, [rows, search, tierFilter, statusFilter]);

  const update = (userId: string, patch: Partial<AdminUserRow>) =>
    setRows((prev) => prev?.map((r) => (r.user_id === userId ? { ...r, ...patch } : r)) ?? null);

  const onTier = async (r: AdminUserRow, tier: "free" | "pro") => {
    setBusy(r.user_id);
    try {
      await setUserTier(r.user_id, tier);
      update(r.user_id, { tier });
      toast({ title: `Set to ${tier === "pro" ? "Pro" : "Free"}` });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const onBlock = async (r: AdminUserRow, blocked: boolean) => {
    setBusy(r.user_id);
    try {
      await setUserBlocked(r.user_id, blocked);
      update(r.user_id, { is_blocked: blocked });
      toast({ title: blocked ? "User blocked" : "User unblocked" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const onAdmin = async (r: AdminUserRow, makeAdmin: boolean) => {
    setBusy(r.user_id);
    try {
      await setUserAdmin(r.user_id, makeAdmin);
      update(r.user_id, { is_admin: makeAdmin });
      toast({ title: makeAdmin ? "Granted admin" : "Revoked admin" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const onPasswordReset = async (r: AdminUserRow) => {
    if (!r.email) {
      toast({ title: "No email available", description: "This user does not have an email address on file.", variant: "destructive" });
      return;
    }
    setBusy(r.user_id);
    try {
      await sendUserPasswordReset(r.email);
      toast({ title: "Password reset sent", description: `A reset email was sent to ${r.email}.` });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const onDelete = async (r: AdminUserRow) => {
    setBusy(r.user_id);
    try {
      await deleteUser(r.user_id);
      setRows((prev) => prev?.filter((row) => row.user_id !== r.user_id) ?? null);
      toast({ title: "User deleted", description: `${r.email ?? r.display_name} was removed.` });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  const totals = useMemo(() => {
    if (!rows) return { total: 0, pro: 0, free: 0, blocked: 0 };
    return {
      total: rows.length,
      pro: rows.filter((r) => r.tier === "pro").length,
      free: rows.filter((r) => r.tier === "free").length,
      blocked: rows.filter((r) => r.is_blocked).length,
    };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Control access, membership tier, and admin privileges for every account.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total users", value: totals.total },
          { label: "Pro members", value: totals.pro },
          { label: "Free members", value: totals.free },
          { label: "Blocked", value: totals.blocked },
        ].map((t) => (
          <Card key={t.label} className="p-4">
            <div className="text-xs text-muted-foreground">{t.label}</div>
            <div className="text-2xl font-bold mt-1">{t.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search email or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={tierFilter} onValueChange={(v) => setTierFilter(v as typeof tierFilter)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        {!filtered ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No users match.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const isMe = r.user_id === me?.id;
                return (
                  <TableRow key={r.user_id}>
                    <TableCell>
                      <div className="font-medium text-sm">{r.display_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.email ?? "(no email)"}</div>
                    </TableCell>
                    <TableCell className="text-sm">Y{r.year_level}</TableCell>
                    <TableCell>
                      <Select
                        value={r.tier}
                        disabled={busy === r.user_id}
                        onValueChange={(v) => onTier(r, v as "free" | "pro")}
                      >
                        <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">{r.attempts_count}</TableCell>
                    <TableCell>
                      {r.is_blocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={r.is_admin}
                          disabled={busy === r.user_id || isMe}
                          onCheckedChange={(v) => onAdmin(r, v)}
                        />
                        {r.is_admin && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          disabled={busy === r.user_id || !r.email}
                          onClick={() => onPasswordReset(r)}
                        >
                          <KeyRound className="w-4 h-4 mr-1" /> Reset
                        </Button>
                        {r.is_blocked ? (
                          <Button
                            variant="ghost" size="sm"
                            disabled={busy === r.user_id}
                            onClick={() => onBlock(r, false)}
                          >
                            <ShieldCheck className="w-4 h-4 mr-1" /> Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="ghost" size="sm"
                            disabled={busy === r.user_id || isMe}
                            onClick={() => onBlock(r, true)}
                          >
                            <UserX className="w-4 h-4 mr-1 text-destructive" /> Block
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost" size="sm"
                              disabled={busy === r.user_id || isMe}
                            >
                              <Trash2 className="w-4 h-4 mr-1 text-destructive" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the user's auth account, profile, and roles. Practice records may remain for audit history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(r)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
