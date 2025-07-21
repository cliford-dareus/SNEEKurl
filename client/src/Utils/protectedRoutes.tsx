import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";

const ProtectedRoutes = () => {
  const user = useAppSelector((state) => state.auth);
  // Check if user has valid auth state (not empty username)
  return user.user.username ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
