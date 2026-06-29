import { NavLink, useLocation } from "@/lib/router";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ShieldCheck, Database, FilePlus2, LayoutDashboard, Wand2, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "All Questions", url: "/admin/questions", icon: Database },
  { title: "Add Question", url: "/admin/questions/new", icon: FilePlus2 },
  { title: "Free Question Sets", url: "/admin/free-sets", icon: Star },
  { title: "AI Generator", url: "/admin/generate", icon: Wand2 },
  { title: "Users", url: "/admin/users", icon: Users },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string, end = false) =>
    end ? pathname === path : pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/" className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0" />
          {!collapsed && <span className="text-base font-bold tracking-tight">Admin</span>}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Question Bank</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.end)}>
                    <NavLink to={item.url} end={item.end} className="hover:bg-muted/50">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 glass-nav sticky top-0 z-40">
            <SidebarTrigger className="mr-3" />
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">ScholarEdge Admin</h1>
              <Badge variant="secondary" className="text-[10px]">Super User</Badge>
            </div>
            <div className="ml-auto">
              <Button asChild variant="ghost" size="sm">
                <NavLink to="/dashboard">Exit Admin</NavLink>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 max-w-7xl w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
