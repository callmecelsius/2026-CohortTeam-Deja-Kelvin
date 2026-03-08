import Dashboard from '@/components/employee/Dashboard';
import useGlobalContext from '@/hooks/useGlobalContext';

export default function EmployeeDashboard() {
  const { user } = useGlobalContext();
  return (
    <div className="p-6">
      <h2>Hi! {user?.firstName}</h2>
      <Dashboard />
    </div>
  );
}
