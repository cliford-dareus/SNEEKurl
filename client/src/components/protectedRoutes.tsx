import React, { ReactNode } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hook";

interface Props {
  children?: ReactNode;
}

const ProtectedRoutes = ({ children, ...rest }: Props) => {
  const user = useAppSelector((state) => state.user.token);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
