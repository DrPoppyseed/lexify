import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PreAuthHeader from "../components/PreAuthHeader";
import OAuthSocialsBox from "../components/OAuthSocialsBox";

const Signup = () => {
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
      <OAuthSocialsBox variant="Signup" />
    </div>
  );
};

export default Signup;
