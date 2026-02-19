import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  return (
    <div className="p-6">
      
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>
      <Link to="/employee-pets">Employee Pets</Link>

    </div>
  );
}
