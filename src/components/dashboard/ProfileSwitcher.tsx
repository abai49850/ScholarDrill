import { ChevronsUpDown, ShieldCheck, LogOut, UserCog, Loader2 } from "lucide-react";
import { Link, useNavigate } from "@/lib/router";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserProfile, type ExamFocus } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { getDisplayYear } from "@/lib/utils/australian-localiser";

interface Props {
  collapsed?: boolean;
}

const YEAR_LEVELS = [3, 5, 7, 9, 10, 11, 12];
const REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const FOCI: { value: ExamFocus; label: string }[] = [
  { value: "naplan", label: "NAPLAN" },
  { value: "selective", label: "Selective" },
  { value: "scholarship", label: "Scholarship" },
];

export function ProfileSwitcher({ collapsed }: Props) {
  const { profile, updateProfile } = useUserProfile();
  const { user, signOut, refreshProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const persistPatch = async (patch: { year_level?: number; region?: string; exam_focus?: string }) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(patch).eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else await refreshProfile();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full flex items-center gap-3 rounded-xl p-2 hover:bg-muted/60 transition-colors text-left"
          aria-label="Open profile menu"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
            {profile.initial}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate flex items-center gap-1">
                  {profile.name}
                  {isAdmin && <UserCog className="w-3 h-3 text-accent" />}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {getDisplayYear(profile.yearLevel, profile.region)} · {profile.region}
                </p>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-72 p-3">
        <div className="space-y-3">
          <div className="px-1">
            <p className="text-sm font-medium truncate">{profile.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>

          <div className="pt-2 border-t border-border space-y-2">
            <Label className="text-xs text-muted-foreground">Study preferences</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] text-muted-foreground">Year</Label>
                <Select
                  value={String(profile.yearLevel)}
                  onValueChange={(v) => { updateProfile({ yearLevel: Number(v) }); void persistPatch({ year_level: Number(v) }); }}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {YEAR_LEVELS.map((y) => (
                      <SelectItem key={y} value={String(y)}>{getDisplayYear(y, profile.region)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Region</Label>
                <Select
                  value={profile.region}
                  onValueChange={(v) => { updateProfile({ region: v }); void persistPatch({ region: v }); }}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Exam focus</Label>
              <Select
                value={profile.examFocus === "all" ? "naplan" : profile.examFocus}
                onValueChange={(v) => { updateProfile({ examFocus: v as ExamFocus }); void persistPatch({ exam_focus: v }); }}
              >
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FOCI.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {saving && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving…
              </p>
            )}
          </div>

          {isAdmin && (
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link to="/admin">
                <ShieldCheck className="w-4 h-4 mr-1" /> Open Admin Dashboard
              </Link>
            </Button>
          )}

          <Button onClick={handleSignOut} size="sm" variant="ghost" className="w-full justify-start">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
