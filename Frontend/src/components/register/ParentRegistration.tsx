import RegistrationForm from '@/components/shared/RegistrationForm';

const ParentRegistration = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-rose-200 p-4">
      <RegistrationForm
        variant="parent"
        title="Parent Registration"
        description="fill out the form to create your account"
      />
    </div>
  );
};

export default ParentRegistration;
