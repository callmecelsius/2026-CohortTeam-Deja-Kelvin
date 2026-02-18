import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Sidebar } from '@/components/ui/sidebar';

export default function FosterPage() {
  return (
    <SidebarProvider>
      <Sidebar />

      <SidebarInset>
        <header className="flex h-16 items-center px-4">
          <SidebarTrigger />
        </header>

        <div className="p-6">
          <h1 className="text-2xl font-bold">Foster Page</h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
