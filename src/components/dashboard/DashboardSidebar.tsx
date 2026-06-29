import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Map,
  BotMessageSquare,
  Users,
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

const parentItems = [
  { title: "Parent Portal", url: "/parent", icon: Users },
];

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
          <div className={`flex w-full items-center justify-center overflow-hidden rounded-xl shadow-sm transition-all ${collapsed ? 'p-0' : ''}`}>
            <img src={collapsed ? "/icon-192.png" : "/logo.png"} alt="ScholarEdge Logo" className={`flex-shrink-0 object-contain transition-all ${collapsed ? 'h-8 w-8' : 'h-auto w-full max-h-9'}`} />
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

        <SidebarGroup>
          <SidebarGroupLabel>Parent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {parentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
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

      </SidebarContent>

      <SidebarFooter className="p-3">
        <ProfileSwitcher collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}
