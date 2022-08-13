import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { RecoilRoot } from "recoil";
import Home from "./pages/Home";

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
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <MuiThemeProvider theme={theme}>
          <EmotionThemeProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                <Route path="c">
                  <Route index element={<div>No note</div>} />
                  <Route path=":id" element={<Home />} />
                </Route>
                <Route path="*" element={<div>Default home</div>} />
              </Routes>
            </BrowserRouter>
            <CssBaseline />
          </EmotionThemeProvider>
        </MuiThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>
);
