import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Users,
  Edit3,
  CheckSquare,
  Bot,
  BarChart3,
  CreditCard,
  Settings,
  UserPlus,
  Plus,
  Bookmark,
  Wand2
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Sample: New Hire Onboarding", url: "/onboarding", icon: Users },
  { title: "Sample: IT Help Desk", url: "/helpdesk", icon: MessageSquare },
  { title: "Sample: Product & Engineering", url: "/product", icon: Wand2 },
  { title: "Sample: Sales & Support", url: "/sales", icon: Users },
];

const toolItems = [
  { title: "Saved and Following", url: "/saved", icon: Bookmark },
  { title: "My Drafts", url: "/drafts", icon: Edit3 },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "AI Agent Center", url: "/agents", icon: Bot },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Card Manager", url: "/cards", icon: CreditCard },
  { title: "Manage", url: "/manage", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            {!collapsed && <span className="font-semibold text-lg">Spursol</span>}
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            className="w-full justify-start" 
            variant="outline"
            size={collapsed ? "icon" : "default"}
          >
            <MessageSquare className="h-4 w-4" />
            {!collapsed && <span className="ml-2">New Chat</span>}
          </Button>
        </div>

        {/* Pages Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* New Page Button */}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
                  <Plus className="h-4 w-4" />
                  {!collapsed && <span>New page</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Section */}
        <div className="mt-auto p-4 space-y-2">
          <SidebarMenuButton className="w-full justify-start">
            <UserPlus className="h-4 w-4" />
            {!collapsed && <span>Invite teammates</span>}
          </SidebarMenuButton>
          
          {!collapsed && (
            <div className="text-xs text-sidebar-foreground/70">
              <span className="text-primary">30 trial days left</span> • <span className="text-primary hover:underline cursor-pointer">Upgrade</span>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}