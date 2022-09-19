import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PreAuthHeader from "../components/PreAuthHeader";
import { useAuth } from "../hooks/useAuth";
import OAuthSocialsBox from "../components/OAuthSocialsBox";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div>
      <PreAuthHeader />
      <OAuthSocialsBox variant="Login" />
    </div>
  );
};

export default Login;
