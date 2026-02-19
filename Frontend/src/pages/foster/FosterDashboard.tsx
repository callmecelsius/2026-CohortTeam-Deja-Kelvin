import { FosterSidebar } from '@/components/FosterSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function FosterPage() {
  return (
    <FosterSidebar>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-bold">Foster Page</h1>
      </div>
    </FosterSidebar>
  );
}
