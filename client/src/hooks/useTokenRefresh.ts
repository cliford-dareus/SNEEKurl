import { useEffect } from "react";
import { useRefreshTokenMutation } from "../app/services/auth";
import { useAppDispatch } from "../app/hook";
import { setCredentials } from "../features/auth/authslice";

export const useTokenRefresh = () => {
  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set up automatic token refresh every 14 minutes (before 15min expiry)
    const interval = setInterval(async () => {
      try {
        const result = await refreshToken().unwrap();
        dispatch(setCredentials({ user: result.user }));
      } catch (error) {
        // Refresh failed, user will be redirected to login by the base query
        console.log("Token refresh failed:", error);
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [refreshToken, dispatch]);
};