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
  currentUser: User | null;
  setCurrentUser: (newUserState: User | null) => void;
  globalLoading: boolean;
  setGlobalLoading: (newGlobalLoadingState: boolean) => void;
};

const authContextDefaultValue: AuthContextType = {
  currentUser: null,
  setCurrentUser: () => {},
  globalLoading: true,
  setGlobalLoading: () => {},
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValue);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(true);
  const [currentUser, setCurrentUser] =
    useState<AuthContextType["currentUser"]>(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(app), (user) => {
      if (user) {
        setCurrentUser(user);
      }
      setGlobalLoading(false);
    });
  });

  const memoizedContextValues = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      globalLoading,
      setGlobalLoading,
    }),
    [currentUser, globalLoading]
  );

  return (
    <AuthContext.Provider value={memoizedContextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
export { AuthContext, AuthProvider };
