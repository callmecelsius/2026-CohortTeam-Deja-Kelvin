import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupContent,
    SidebarMenu,
    SidebarHeader,
} from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react";
import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/paws.png';

export type NavItem = {
    name: string;
    href: string;
    icon: LucideIcon;
}

type AppSidebarProps = {
  label: string;
  navItems: NavItem[];
};

export function AppSidebar({label, navItems}: AppSidebarProps) {
    const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-indigo-200 dark:border-indigo-800/40 bg-linear-to-b from-gray-800 to-gray-900 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Cuddle Buddies Logo" className="h-10 w-auto object-contain" />
          <span className="text-base font-bold tracking-tight text-white">
            Cuddle Buddies
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <Link to={item.href}>
                        <Icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Home">
              <Link to="/">
                <Home />
                <span>Back to Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}



