import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Home,
  Map,
  BotMessageSquare,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "@/lib/router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ProfileSwitcher } from "@/components/dashboard/ProfileSwitcher";
import { useAuth } from "@/contexts/AuthContext";

const mainItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, end: true },
  { title: "Practice", url: "/practice", icon: BookOpen },
  { title: "Journey", url: "/journey", icon: Map },
  { title: "AI Coach", url: "/coach", icon: BotMessageSquare },
];

const homeItem = { title: "Home", url: "/dashboard", icon: Home };

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin } = useAuth();

  const isActive = (path: string, end?: boolean) =>
    end ? currentPath === path : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/dashboard" className="flex items-center justify-center w-full py-1">
          <div className={`bg-slate-900 rounded-xl flex items-center justify-center shadow-sm transition-all w-full ${collapsed ? 'p-1' : 'px-2 py-1'}`}>
            <img src="/logo.png" alt="ScholarDrill Logo" className={`object-contain flex-shrink-0 transition-all ${collapsed ? 'w-6 h-6' : 'w-full h-auto max-h-8'}`} />
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Study</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.end)}>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={currentPath.startsWith("/admin")}>
                    <NavLink to="/admin" className="hover:bg-muted/50" activeClassName="bg-accent/10 text-accent font-medium">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      {!collapsed && <span>Admin Dashboard</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={currentPath === homeItem.url}>
                  <NavLink to={homeItem.url} className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                    <homeItem.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{homeItem.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <ProfileSwitcher collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}
