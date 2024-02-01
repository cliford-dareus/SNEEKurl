import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { Props } from "./types/types";

const ProtectedRoutes = ({ children, ...rest }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  return user.username ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
