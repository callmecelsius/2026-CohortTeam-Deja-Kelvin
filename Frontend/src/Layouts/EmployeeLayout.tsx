import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/SideBar';
import type { NavItem } from '@/components/shared/SideBar';
import { Box, LayoutDashboard, PawPrint, Users } from 'lucide-react';
import { UserAvatar } from '@/components/shared/UserAvatar';

const employeeNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/employee-page', icon: LayoutDashboard },
  { name: 'Foster Parents', href: '/employee-foster-parents-page', icon: Users },
  { name: 'Inventory', href: '/employee-inventory-page', icon: Box },
  { name: 'Pets', href: '/employee-pets-page', icon: PawPrint },
];

export default function EmployeeLayout() {
  return (
    <SidebarProvider>
      <AppSidebar label="Employee" navItems={employeeNavItems} />
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="flex h-16 items-center justify-between px-4">
          <SidebarTrigger />
          <UserAvatar />
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
