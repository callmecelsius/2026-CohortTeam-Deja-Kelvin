import Dashboard from '@/components/employee/Dashboard';
import useGlobalContext from '@/hooks/useGlobalContext';

export default function EmployeeDashboard() {
  const { user } = useGlobalContext();
  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening today.
        </p>
      </div>
      <div className="flex-1">
        <Dashboard />
      </div>
    </div>
  );
}
