import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { Props } from "../types/types";

const ProtectedRoutes = ({ children, ...rest }: Props) => {
  const user = useAppSelector((state) => state.user.userId);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
