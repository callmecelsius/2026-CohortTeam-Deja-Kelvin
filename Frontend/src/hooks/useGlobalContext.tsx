import { createContext, useContext } from 'react';
import type { User } from '../../types/UserType';

type GlobalContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const GlobalContextObject: GlobalContextType = {
  user: null,
  setUser: () => {},
};

export const UserContext = createContext(GlobalContextObject);
const useGlobalContext = () => useContext(UserContext);

export default useGlobalContext;
