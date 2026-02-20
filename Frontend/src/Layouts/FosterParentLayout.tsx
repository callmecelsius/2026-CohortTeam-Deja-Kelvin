import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/SideBar';
import type { NavItem } from '@/components/shared/SideBar';
import { LayoutDashboard, PawPrint, ShoppingBag } from 'lucide-react';
import { UserAvatar } from '@/components/shared/UserAvatar';

const fosterNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/foster-page', icon: LayoutDashboard },
  { name: 'My Pets', href: '/foster-pets-page', icon: PawPrint },
  { name: 'Store', href: '/foster-store-page', icon: ShoppingBag },
];

export default function FosterParentLayout() {
  return (
    <SidebarProvider>
      <AppSidebar label="Foster" navItems={fosterNavItems} />
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
