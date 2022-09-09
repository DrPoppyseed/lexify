import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return user ? <>children</> : <Navigate to="/" />;
};

export default ProtectedRoute;
