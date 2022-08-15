import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { RecoilRoot } from "recoil";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const theme = createTheme({
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div />}>
        <AuthProvider>
          <RecoilRoot>
            <MuiThemeProvider theme={theme}>
              <EmotionThemeProvider theme={theme}>
                <CssBaseline />
                <App />
              </EmotionThemeProvider>
            </MuiThemeProvider>
          </RecoilRoot>
        </AuthProvider>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
);
