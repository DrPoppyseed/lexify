import { Route, Routes } from "react-router-dom";
import React, { lazy, useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { useResetCollections } from "./state/collectionsState";

const NotFound = lazy(() => import("./pages/NotFound"));
const Landing = lazy(() => import("./pages/Landing"));
const Loading = lazy(() => import("./pages/Loading"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

const App = () => {
    const {user, authLoading} = useContext(AuthContext);
    const resetCollections = useResetCollections()

    useEffect(() => {
        resetCollections()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return authLoading ? (
        <Loading/>
    ) : (
        <Routes>
            <Route path="/">
                <Route index element={user ? <Home/> : <Landing/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="signup" element={<Signup/>}/>
                <Route
                    path=":id"
                    element={
                        <ProtectedRoute>
                            <Home/>
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default App;
