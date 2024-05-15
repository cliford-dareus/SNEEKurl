import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector} from "../app/hook";

const ProtectedRoutes = () => {
  const user = useAppSelector((state) => state.auth);
  console.log(user);
  return user.token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
