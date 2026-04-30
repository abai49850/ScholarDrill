import { Check, ChevronsUpDown, UserCog } from "lucide-react";
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
import { useUserProfile, PRESET_PROFILES, type ExamFocus } from "@/contexts/UserProfileContext";

interface Props {
  collapsed?: boolean;
}

const YEAR_LEVELS = [3, 5, 7, 9];
const REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT", "ALL"];
const FOCI: { value: ExamFocus; label: string }[] = [
  { value: "all", label: "All exams" },
  { value: "naplan", label: "NAPLAN" },
  { value: "selective", label: "Selective" },
  { value: "scholarship", label: "Scholarship" },
];

export function ProfileSwitcher({ collapsed }: Props) {
  const { profile, setProfile, updateProfile } = useUserProfile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full flex items-center gap-3 rounded-xl p-2 hover:bg-muted/60 transition-colors text-left"
          aria-label="Switch profile"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
            {profile.initial}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate flex items-center gap-1">
                  {profile.name}
                  {profile.isSuperUser && <UserCog className="w-3 h-3 text-accent" />}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Year {profile.yearLevel} · {profile.region}
                </p>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-72 p-3">
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Switch persona</Label>
            <div className="space-y-1 max-h-44 overflow-y-auto">
              {PRESET_PROFILES.map((p) => {
                const active = p.id === profile.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProfile(p)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-sm transition-colors ${
                      active ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {p.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate flex items-center gap-1">
                        {p.name}
                        {p.isSuperUser && <UserCog className="w-3 h-3 text-accent" />}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        Year {p.yearLevel} · {p.region} · {p.examFocus}
                      </div>
                    </div>
                    {active && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {profile.isSuperUser && (
            <div className="pt-3 border-t border-border space-y-2">
              <Label className="text-xs text-muted-foreground">Super-user overrides</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Year</Label>
                  <Select
                    value={String(profile.yearLevel)}
                    onValueChange={(v) => updateProfile({ yearLevel: Number(v) })}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {YEAR_LEVELS.map((y) => (
                        <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Region</Label>
                  <Select
                    value={profile.region}
                    onValueChange={(v) => updateProfile({ region: v })}
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
                  value={profile.examFocus}
                  onValueChange={(v) => updateProfile({ examFocus: v as ExamFocus })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FOCI.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Super user can swap year, region & exam focus on the fly to walk through the full UX.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
