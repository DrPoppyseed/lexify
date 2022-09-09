import {
  ButtonBase,
  Divider,
  FormControl as MuiFormControl,
  FormLabel,
  InputBase,
  styled,
  Typography,
} from "@mui/material";
import {GitHub, Google} from "@mui/icons-material";
import {getAuth, signInWithPopup} from "firebase/auth";
import PreAuthHeader from "../components/PreAuthHeader";
import {githubAuthProvider, googleAuthProvider} from "../config/firebase";

const Login = () => {
  const loginWithGoogle = async () => {
    console.log("google login button clicked");
    const auth = getAuth();
    const signedInUser = await signInWithPopup(auth, googleAuthProvider);

    if (signedInUser) {
      console.log(signedInUser);
    }
  };

  const loginWithGithub = async () => {
    console.log("github login button clicked");
    const auth = getAuth();
    const signedInUser = await signInWithPopup(auth, githubAuthProvider);

    if (signedInUser) {
      console.log(signedInUser)
    }
  };

  const loginWithEmailLink = () => {
    console.log("github login button clicked");
  };

  return (
      <LoginBase>
        <PreAuthHeader/>
        <Prompt>
          <Typography variant="h3">
            <b>Login</b>
          </Typography>
          <FlatButton onClick={loginWithGoogle}>
            <Google/>
            <Typography>Login with Google</Typography>
          </FlatButton>
          <FlatButton onClick={loginWithGithub}>
            <GitHub/>
            <Typography>Login with Github</Typography>
          </FlatButton>
          <Divider flexItem>Or</Divider>
          <FormControl>
            <FormLabel>email</FormLabel>
            <FlatInput/>
          </FormControl>
        </Prompt>
      </LoginBase>
  );
};

const LoginBase = styled("div")``;

const Prompt = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;

  & > h3 {
    margin-bottom: ${({theme}) => theme.spacing(2)};
  }
`;

const FlatButton = styled(ButtonBase)`
  padding: ${({theme}) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  width: ${({theme}) => theme.spacing(36)};
  border-radius: 3px;
  background-color: #fff;
  border: 1px solid rgba(15, 15, 15, 0.15);
  margin-bottom: ${({theme}) => theme.spacing(2)};

  & > svg {
    margin-right: ${({theme}) => theme.spacing(1)};
  }
`;

const FlatInput = styled(InputBase)`
    // margin-top: ${({theme}) => theme.spacing(2)};
  border: 1px solid rgba(15, 15, 15, 0.15);
  border-radius: 3px;
  padding: ${({theme}) => `${theme.spacing(0.5)} ${theme.spacing(3)}`};
  width: ${({theme}) => theme.spacing(36)};
`;

const FormControl = styled(MuiFormControl)`
  margin-top: ${({theme}) => theme.spacing(2)};
`;

export default Login;
