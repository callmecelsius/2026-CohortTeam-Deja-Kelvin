import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/SideBar';
import type { NavItem } from '@/components/SideBar';
import { LayoutDashboard, PawPrint, ShoppingBag } from 'lucide-react';


const fosterNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/foster-page', icon: LayoutDashboard },
  { name: 'Pets', href: '/foster-pets-page', icon: PawPrint },
  { name: 'Store', href: '/foster-store-page', icon: ShoppingBag },
];

export default function FosterParentLayout() {
  return (
    <SidebarProvider>
      <AppSidebar label="Foster" navItems={fosterNavItems} />
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="flex h-16 items-center px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
