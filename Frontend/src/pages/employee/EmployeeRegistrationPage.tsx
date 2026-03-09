import RegistrationForm from '@/components/shared/RegistrationForm';

export default function EmployeeRegistrationPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <RegistrationForm
        variant="employee"
        title="Employee Registration"
        description="create an employee account"
      />
    </div>
  );
}
