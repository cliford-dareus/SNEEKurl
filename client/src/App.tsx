import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import ProtectedRoutes from "./Utils/protectedRoutes";
import Recent from "./pages/recent";
import Favorite from "./pages/favorite";
import Layout from "./components/layout";
import Myurl from "./components/myurl";
import Login from "./features/auth/Login";

function App() {
  return (
    <div className=" bg-black">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

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
      //{" "}
    </div>
  );
}

export default App;
