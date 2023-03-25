import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div>
      <p>Account...</p>
    </div>
  );
};

export default Account;
