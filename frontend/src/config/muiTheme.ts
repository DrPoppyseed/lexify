import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#11999E",
      dark: "#40514E",
    },
    secondary: {
      main: "#30E3CA",
    },
    error: {
      main: "#FFB6B9",
    },
    success: {
      main: "#61C0BF",
    },
  },
  spacing: 8,
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
  },
  typography: {
    h3: {
      color: "#111111",
    },
    h6: {
      color: "#111111",
    },
    body1: {
      color: "#111111",
    },
  },
});
