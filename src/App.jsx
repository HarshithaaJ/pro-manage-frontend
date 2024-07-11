import { useEffect, useState } from "react";
import { validateUserFromToken } from "./apis/auth";
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuthCheck from "./components/AuthCheck.jsx";
import UserProvider from "./context/user.context.js";
import PageWrap from "./components/page-wrapper/PageWrap.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import Spinner from "./components/Spinner.jsx";
import ViewTask from "./pages/ViewTask.jsx";


function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    id: "",
    name: "",
    isAuth: false,
  })

  const login = ({id, name})=> {
    setUser({id, name, isAuth: true})
  }

  const logout = ()=> {
    setUser({id: "", name: "", isAuth: false})
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken) {
      (async()=> {
        const {data: userData, error} = await validateUserFromToken(accessToken);
        if(error) {
          localStorage.removeItem("accessToken");
          setLoading(false);
          return;
        }
        login({...userData})
        setLoading(false);
      })();
    } 
    else setLoading(false);
  }, []);


  return !loading ? (
    <UserProvider
      value={{
        user,
        login,
        logout,
        updateUser: (updatedUser = {}) =>
          setUser((prev) => ({ ...prev, ...updatedUser })),
      }}
    >
      <Routes>
        <Route path="/" element={<PageWrap />}>
          <Route path="/" element={<Navigate to={"/dashboard"} replace={true} />} />
          <Route
            path="/dashboard"
            element={
              <AuthCheck authentication>
                {" "}
                <Dashboard />
              </AuthCheck>
            }
          />
          <Route
            path="/analytics"
            element={
              <AuthCheck authentication>
                {" "}
                <Analytics />
              </AuthCheck>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthCheck authentication>
                {" "}
                <Settings />
              </AuthCheck>
            }
          />
        </Route>
        <Route
          path="/register"
          element={
            <AuthCheck authentication={false}>
              {" "}
              <Register />
            </AuthCheck>
          }
        />
        <Route
          path="/login"
          element={
            <AuthCheck authentication={false}>
              {" "}
              <Login />
            </AuthCheck>
          }
        />
        <Route
          path="/view/:taskId"
          element={
              <ViewTask />
          }
        />
      </Routes>
    </UserProvider>
  ) : (
    <div style={{width: "100vw", height: "100vh"}}>
      <Spinner />
    </div>
  );
}

export default App