import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { ReactNode } from "react";

type Props = {
  children: ReactNode
}

const ProtectedRoutes = () => {
  const user = useAppSelector((state) => state.auth.user);
  return user.username ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
