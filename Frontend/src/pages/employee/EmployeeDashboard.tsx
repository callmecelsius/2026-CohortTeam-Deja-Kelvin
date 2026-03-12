import Dashboard from '@/components/employee/Dashboard';
import useGlobalContext from '@/hooks/useGlobalContext';

export default function EmployeeDashboard() {
  const { user } = useGlobalContext();
  return (
    <div className="w-full p-4">
      <div className="-mt-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening today.
        </p>
      </div>
      <Dashboard />
    </div>
  );
}
