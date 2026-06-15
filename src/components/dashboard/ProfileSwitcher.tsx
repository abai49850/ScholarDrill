import { ChevronsUpDown, ShieldCheck, LogOut, UserCog } from "lucide-react";
import { Link, useNavigate } from "@/lib/router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { getDisplayYear } from "@/lib/utils/australian-localiser";

interface Props {
  collapsed?: boolean;
}

export function ProfileSwitcher({ collapsed }: Props) {
  const { profile } = useUserProfile();
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

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
                  {getDisplayYear(profile.yearLevel, profile.region)} - {profile.region}
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

          <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            Study preferences are now at the top of the dashboard.
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
