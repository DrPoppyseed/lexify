import {
  AppBar as MuiAppBar,
  ButtonBase,
  Grid,
  styled,
  Toolbar as MuiToolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CTAButton = () => {
  const navigate = useNavigate();
  return (
    <FlatButton
      onClick={(e) => {
        e.preventDefault();
        navigate("/login");
      }}
    >
      <Typography color="#fff">
        <b>Try Lexify free</b>
      </Typography>
    </FlatButton>
  );
};

const Landing = () => (
  <LandingBase container>
    <AppBar position="fixed" elevation={0}>
      <Toolbar>
        <ButtonBase>
          <Typography>
            <b>Lexify</b>
          </Typography>
        </ButtonBase>
        <CTAButton />
      </Toolbar>
    </AppBar>

    <Title>
      <Typography variant="h3">
        <b>Want a digital vocabulary book?</b>
        <br /> We can help.
      </Typography>
      <Typography variant="h6">
        Lexify is a dead simple vocabulary card builder.
      </Typography>
      <CTAButton />
    </Title>
  </LandingBase>
);

const LandingBase = styled(Grid)`
  height: 100%;
  width: 100%;
`;

const Title = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;

  & > h3,
  & > h6 {
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }
`;

const AppBar = styled(MuiAppBar)`
  width: 100%;
  background-color: #fffcf7;

  padding: ${({ theme }) => `0 ${theme.spacing(16)}`};

  ${({ theme }) => theme.breakpoints.down("lg")} {
    padding: ${({ theme }) => `0 ${theme.spacing(8)}`};
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: ${({ theme }) => `0 ${theme.spacing(4)}`};
  }
`;

const Toolbar = styled(MuiToolbar)`
  display: flex;
  justify-content: space-between;
`;

const FlatButton = styled(ButtonBase)`
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  width: max-content;
  border-radius: 3px;
  background-color: #3ec70b;
  color: #fff;
`;

export default Landing;
