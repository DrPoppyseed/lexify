import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../config/firebase";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  authLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
};

const authContextDefaultValue: AuthContextType = {
  user: null,
  setUser: () => {},
  authLoading: true,
  setAuthLoading: () => {},
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValue);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(app), (user) => {
      if (user) {
        setUser(user);
      }
      setAuthLoading(false);
    });
  });

  const memoizedContextValues = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      setAuthLoading,
    }),
    [user, authLoading]
  );

  return (
    <AuthContext.Provider value={memoizedContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
export { AuthContext, AuthProvider };
