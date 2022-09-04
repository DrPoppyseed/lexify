import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, {lazy, useContext} from "react";
import {AuthContext} from "./contexts/AuthContext"; // const Home = lazy(() => import("./pages/Home"));

// const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Landing = lazy(() => import("./pages/Landing"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));

const App = () => {
  const { currentUser, globalLoading } = useContext(AuthContext);

  return globalLoading ? (
    <div>Loading!</div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={currentUser ? <Home /> : <Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path=":id" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;