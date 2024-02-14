import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { ReactNode } from "react";

type Props = {
  children: ReactNode
}

const ProtectedRoutes = () => {
  const user = useAppSelector((state) => state.auth);
  return user.user.username ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
