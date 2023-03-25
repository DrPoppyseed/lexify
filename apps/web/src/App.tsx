import * as React from "react";
import { Route, Routes } from "react-router-dom";

import { AuthContext } from "./contexts/AuthContext";

const NotFound = React.lazy(() => import("./pages/NotFound"));
const Landing = React.lazy(() => import("./pages/Landing"));
const Loading = React.lazy(() => import("./pages/Loading"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Login = React.lazy(() => import("./pages/Login"));
const Account = React.lazy(() => import("./pages/Account"));
const Home = React.lazy(() => import("./pages/Home"));
const ProtectedRoute = React.lazy(() => import("./ProtectedRoute"));

const App = () => {
  const { user, authLoading } = React.useContext(AuthContext);

  return authLoading ? (
    <Loading />
  ) : (
    <Routes>
      <Route path="/">
        <Route index element={user ? <Home /> : <Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="account" element={<Account />} />
        <Route
          path=":id"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
