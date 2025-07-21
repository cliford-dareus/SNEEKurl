import { useAppSelector } from "../app/hook";
import { AuthState } from "../features/auth/authslice";

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth) as AuthState;
  
  return {
    user: auth.user,
    isAuthenticated: !!auth.user.username,
    isVerified: auth.user.isVerified,
    hasStripeAccount: !!auth.user.stripe_account_id,
  };
};