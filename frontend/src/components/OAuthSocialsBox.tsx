import { ButtonBase, styled, Typography } from "@mui/material";
import { GitHub, Google } from "@mui/icons-material";
import { FC } from "react";
import { Link } from "react-router-dom";
import { useGithubOAuth, useGoogleOAuth } from "../hooks/useOAuth";

type AuthVariant = "Signup" | "Login";
type Props = { variant: AuthVariant };

const SignupLoginText: FC<Props> = ({ variant }) => {
  const link = variant === "Signup" ? "login" : "signup";

  return (
    <SignupLoginTextBase>
      Or <Link to={`/${link}`}>{link}</Link> if you{" "}
      {variant === "Signup" && " don't "} have one.
    </SignupLoginTextBase>
  );
};

const OAuthSocialsBox: FC<Props> = ({ variant }) => {
  const githubOAuth = useGithubOAuth();
  const googleOAuth = useGoogleOAuth();

  return (
    <OAuthSocialsBoxBase>
      <Typography variant="h3">
        <b>{variant}</b>
      </Typography>
      <FlatButton onClick={googleOAuth}>
        <Google />
        <Typography>{variant} with Google</Typography>
      </FlatButton>
      <FlatButton onClick={githubOAuth}>
        <GitHub />
        <Typography>{variant} with Github</Typography>
      </FlatButton>
      <SignupLoginText variant={variant} />
    </OAuthSocialsBoxBase>
  );
};

const OAuthSocialsBoxBase = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;

  & > h3 {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

const FlatButton = styled(ButtonBase)`
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  width: ${({ theme }) => theme.spacing(36)};
  border-radius: 3px;
  background-color: #fff;
  border: 1px solid rgba(15, 15, 15, 0.15);
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  & > svg {
    margin-right: ${({ theme }) => theme.spacing(1)};
  }
`;

const SignupLoginTextBase = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export default OAuthSocialsBox;
