import { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import ProtectedRoutes from "./Utils/protectedRoutes";
import Recent from "./pages/recent";
import Favorite from "./pages/favorite";
import Layout from "./components/layout";
import Myurl from "./components/myurl";
import Login from "./features/auth/login";
import Register from "./features/auth/register";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

function App() {
  const fpPromise = FingerprintJS.load();

  useEffect(() => {
    const getUser = async () => {
      try {
        const fp = await fpPromise;
        const result = await fp.get();
        
        await fetch(
          `http://localhost:4080/sneekurl/fp?client_id=${result.visitorId}`,
          {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  return (
    <div className=" bg-black">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />}>
              <Route path="/yoururl" element={<Myurl />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
              <Route path="/recent" element={<Recent />} />
              <Route path="/favorite" element={<Favorite />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
