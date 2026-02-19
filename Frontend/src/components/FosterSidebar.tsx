// import { Link, useLocation } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   PawPrint,
// } from 'lucide-react';
// import {
//   SidebarProvider,
//   SidebarInset,
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from '@/components/ui/sidebar';

// const fosterNavItems = [
//   { name: 'Dashboard', href: '/foster-page', icon: LayoutDashboard },
//   { name: 'Pets', href: '/foster-pets-page', icon: PawPrint },
//   { name: 'Store', href: '/foster-store-page', icon: ShoppingBag },
// ];

// type FosterSidebarProps = {
//   children: React.ReactNode;
// };

// export function FosterSidebar({ children }: FosterSidebarProps) {
//   const location = useLocation();

//   return (
//     <SidebarProvider>
//       <Sidebar>
//         <SidebarContent>
//           <SidebarGroup>
//             <SidebarGroupLabel>Foster</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {fosterNavItems.map((item) => {
//                   const isActive = location.pathname === item.href;
//                   const Icon = item.ic`on;
//                   return (
//                     <SidebarMenuItem key={item.name}>
//                       <SidebarMenuButton
//                         asChild
//                         isActive={isActive}
//                         tooltip={item.name}
//                       >
//                         <Link to={item.href}>
//                           <Icon />
//                           <span>{item.name}</span>
//                         </Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   );
//                 })}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//       </Sidebar>

//       <SidebarInset>{children}</SidebarInset>
//     </SidebarProvider>
//   );
// }
