import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/SideBar';
import type { NavItem } from '@/components/shared/SideBar';
import {
  Box,
  Home,
  LayoutDashboard,
  PawPrint,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Navigate, Outlet } from 'react-router-dom';
import useGlobalContext from '@/hooks/useGlobalContext';

const fosterNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/foster-page', icon: LayoutDashboard },
  { name: 'My Pets', href: '/foster-pets-page', icon: PawPrint },
  { name: 'Store', href: '/foster-store-page', icon: ShoppingBag },
];

const employeeNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/employee-page', icon: LayoutDashboard },
  {
    name: 'Foster Parents',
    href: '/employee-foster-parents-page',
    icon: Users,
  },
  { name: 'Foster Homes', href: '/employee-foster-homes-page', icon: Home },
  { name: 'Inventory', href: '/employee-inventory-page', icon: Box },
  { name: 'Pets', href: '/employee-pets-page', icon: PawPrint },
];

export default function AuthLayout({ usersRole }: { usersRole: string }) {
  const { user } = useGlobalContext();
  console.log('user?.roles?', user?.roles);

  if (user === null || user.email === '' || user.id === null)
    return <Navigate to="/" replace />;
  if (!user?.roles?.includes('employee') && usersRole === 'employee') {
    return <Navigate to="/foster-page" replace />;
  }
  const navItem =
    user?.roles?.includes('employee') && usersRole === 'employee'
      ? employeeNavItems
      : fosterNavItems;
  const label =
    user?.roles?.includes('employee') && usersRole === 'employee'
      ? 'Employee'
      : 'Foster';

  return (
    <SidebarProvider>
      <AppSidebar label={label} navItems={navItem} />
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
