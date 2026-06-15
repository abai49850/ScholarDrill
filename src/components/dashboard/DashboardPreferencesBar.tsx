import { Loader2, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, type ExamFocus } from "@/contexts/UserProfileContext";
import { supabase } from "@/integrations/supabase/client";
import { getDisplayYear } from "@/lib/utils/australian-localiser";
import { toast } from "sonner";

const YEAR_LEVELS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const FOCI: { value: ExamFocus; label: string }[] = [
  { value: "selective", label: "Selective entry" },
  { value: "scholarship", label: "Scholarships" },
  { value: "naplan", label: "NAPLAN" },
  { value: "all", label: "All exams" },
];

export function DashboardPreferencesBar() {
  const { profile, updateProfile } = useUserProfile();
  const { user, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const persistPatch = async (patch: { year_level?: number; region?: string; exam_focus?: string }) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(patch).eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else void refreshProfile();
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold">Study preferences</h2>
            <p className="text-sm text-muted-foreground">
              Use these to shape dashboard recommendations and practice test ordering.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[620px]">
          <div>
            <Label className="text-xs text-muted-foreground">Year level</Label>
            <Select
              value={String(profile.yearLevel)}
              onValueChange={(value) => {
                const yearLevel = Number(value);
                updateProfile({ yearLevel });
                void persistPatch({ year_level: yearLevel });
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEAR_LEVELS.map((year) => (
                  <SelectItem key={year} value={String(year)}>{getDisplayYear(year, profile.region)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Region</Label>
            <Select
              value={profile.region}
              onValueChange={(region) => {
                updateProfile({ region });
                void persistPatch({ region });
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Exam focus</Label>
            <Select
              value={profile.examFocus}
              onValueChange={(examFocus) => {
                updateProfile({ examFocus: examFocus as ExamFocus });
                void persistPatch({ exam_focus: examFocus });
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FOCI.map((focus) => (
                  <SelectItem key={focus.value} value={focus.value}>{focus.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {saving && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving
          </div>
        )}
      </div>
    </section>
  );
}
