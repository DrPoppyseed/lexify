import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { theme } from "./config/muiTheme";
import { AppStateProvider } from "./contexts/AppStateContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div />}>
        <BrowserRouter>
          <AuthProvider>
            <AppStateProvider>
              <MuiThemeProvider theme={theme}>
                <EmotionThemeProvider theme={theme}>
                  <CssBaseline />
                  <App />
                </EmotionThemeProvider>
              </MuiThemeProvider>
            </AppStateProvider>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
);
