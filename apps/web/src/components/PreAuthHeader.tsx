import {
  AppBar as MuiAppBar,
  ButtonBase,
  styled,
  Toolbar as MuiToolbar,
  Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const PreAuthHeader: FC<{ children?: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar>
        <ButtonBase
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <Typography>
            <b>Lexify</b>
          </Typography>
        </ButtonBase>
        {children}
      </Toolbar>
    </AppBar>
  );
};

const AppBar = styled(MuiAppBar)`
  width: 100%;
  background-color: #fffcf7;

  padding: ${({theme}) => `0 ${theme.spacing(16)}`};

  ${({theme}) => theme.breakpoints.down("lg")} {
    padding: ${({theme}) => `0 ${theme.spacing(8)}`};
  }

  ${({theme}) => theme.breakpoints.down("md")} {
    padding: ${({theme}) => `0 ${theme.spacing(4)}`};
  }
`;

const Toolbar = styled(MuiToolbar)`
  display: flex;
  justify-content: space-between;
`;

export default PreAuthHeader;
