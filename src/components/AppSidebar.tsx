import { NavLink, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Database,
  Bot
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Sources", url: "/sources", icon: Database },
  { title: "Knowledge Agents", url: "/agents", icon: Bot },
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
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        {/* Header */}
        <div className={`p-4 border-b border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            {!collapsed && <span className="font-semibold text-lg ml-2">Spursol</span>}
          </div>
        </div>

        {/* New Chat Button */}
        <div className={`${collapsed ? 'px-2 py-2' : 'p-4'}`}>
          {collapsed ? (
            <Button 
              className="w-10 h-10 p-0" 
              variant="chat"
              size="icon"
              asChild
            >
              <NavLink to="/">
                <MessageSquare className="h-4 w-4" />
              </NavLink>
            </Button>
          ) : (
            <Button 
              className="w-full justify-start" 
              variant="chat"
              asChild
            >
              <NavLink to="/">
                <MessageSquare className="h-4 w-4" />
                <span className="ml-2">New Chat</span>
              </NavLink>
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <SidebarGroup className={collapsed ? 'px-2' : ''}>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={collapsed ? 'w-10 h-10 p-0 justify-center' : ''}
                  >
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-2">{item.title}</span>}
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