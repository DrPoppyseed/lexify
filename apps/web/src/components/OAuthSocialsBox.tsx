import { GitHub, Google } from "@mui/icons-material";
import * as React from "react";
import { Link } from "react-router-dom";

import { useGithubOAuth, useGoogleOAuth } from "../hooks/useOAuth";
import { Button } from "../primitives/Button";

export type AuthVariant = "SignUp" | "Login";

export const OAuthSocialsBox: React.FC<{ variant: AuthVariant }> = ({
  variant,
}) => {
  const githubOAuth = useGithubOAuth();
  const googleOAuth = useGoogleOAuth();
  const link = variant === "SignUp" ? "login" : "signup";

  return (
    <div className="absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
      <h3 className="mb-2">
        <b>{variant}</b>
      </h3>
      <Button onClick={() => googleOAuth()}>
        <Google />
        <p>{variant} with Google</p>
      </Button>
      <Button onClick={() => githubOAuth()}>
        <GitHub />
        <p>{variant} with Github</p>
      </Button>

      <p className="mb-2">
        Or <Link to={`/${link}`}>{link}</Link> if you
        {variant === "SignUp" && " don't "} have one.
      </p>
    </div>
  );
};
