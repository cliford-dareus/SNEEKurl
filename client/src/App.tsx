import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Recent from "./pages/recent";
import Favorite from "./pages/links";
import Layout from "./components/layout";
import Myurl from "./components/myurl";
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Report from "./pages/test";
import ProtectedRoutes from "./Utils/protectedRoutes";
import Pricing from "./pages/pricing";
import Checkout from "./components/checkout";
import { useIdentifyUserMutation } from "./app/services/auth";
import { setCredentials } from "./features/auth/authslice";
import useLocalStorage from "./Utils/hooks/use-local-storage";
import { useAppDispatch } from "./app/hook";
import AdminLayout from "./components/admin-layout";

function App() {
  const dispatch = useAppDispatch();
  const [values, setValue] = useLocalStorage("token", "");
  const [identify] = useIdentifyUserMutation();
  const fpPromise = FingerprintJS.load();

  useEffect(() => {
    const getUser = async () => {
      const fp = await fpPromise;
      const result = await fp.get();
      try {
        const data = await identify(result).unwrap();
        data.token && setValue(JSON.stringify(data.token));
        dispatch(
          setCredentials({
            user: {
              username: data.user.username,
              stripe_account_id: data.user.stripe_account_id,
              isVerified: data.user.isVerified,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  return (
    <div className="bg-[radial-gradient(circle,rgba(2,_0,_36,_0)_0%,#fafafa_100%)] dark:bg-[radial-gradient(circle,rgba(2,_0,_36,_0)_0%,#010101_100%)]">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/test" element={<Report />} />
            <Route path="/pricing" element={<Pricing />}>
              <Route path="checkout" element={<Checkout />} />
            </Route>
            <Route path="/" element={<Dashboard />}>
              <Route path="/yoururl" element={<Myurl />} />
            </Route>
          </Route>
          
          <Route element={<AdminLayout />}>
            <Route element={<ProtectedRoutes />}>
              <Route path="/links" element={<Favorite />} />
              <Route path="/account" element={<Recent />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
