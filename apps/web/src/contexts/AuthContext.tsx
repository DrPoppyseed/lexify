import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../config/firebase";

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<AuthContextType["user"]>>;
  authLoading: boolean;
  setAuthLoading: Dispatch<SetStateAction<AuthContextType["authLoading"]>>;
};

const authContextDefaultValue: AuthContextType = {
  user: null,
  setUser: () => {},
  authLoading: true,
  setAuthLoading: () => {},
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValue);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(
    authContextDefaultValue.authLoading
  );
  const [user, setUser] = useState<AuthContextType["user"]>(
    authContextDefaultValue.user
  );

  useEffect(() => {
    onAuthStateChanged(getAuth(firebaseApp), (authnedUser) => {
      if (authnedUser) {
        setUser(authnedUser);
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

export { AuthContext, AuthProvider };
