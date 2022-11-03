import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
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
      <Typography>Account...</Typography>
    </div>
  );
};

export default Account;
