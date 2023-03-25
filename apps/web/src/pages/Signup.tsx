import * as React from "react";
import { useNavigate } from "react-router-dom";

import { OAuthSocialsBox } from "../components/OAuthSocialsBox";
import { PreAuthHeader } from "../components/PreAuthHeader";
import { useAuth } from "../hooks/useAuth";

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div>
      <PreAuthHeader />
      <OAuthSocialsBox variant="SignUp" />
    </div>
  );
};

export default SignUp;
