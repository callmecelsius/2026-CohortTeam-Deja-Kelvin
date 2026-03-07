import { useCallback, useState } from 'react';
import { UserContext } from './useGlobalContext';
import type { User } from '../../types/UserType';

const defaultUser: User = {
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
};

export default function GlobalContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(null);

  const setUser = useCallback((user: User | null) => {
    if (user === null) {
      setUserState(null);
      return;
    }

    if (user?.employeeId !== null) {
      user.roles = ['employee'];
    }

    if (user?.fosterParent !== null) {
      user.roles = user.roles
        ? [...user.roles, 'foster-parent']
        : ['foster-parent'];
    }

    setUserState(user);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user || defaultUser,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
