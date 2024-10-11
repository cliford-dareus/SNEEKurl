import { Outlet, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../app/hook";
import { AuthState, selectCurrentUser } from "../../features/auth/authslice";
import { useRetrieveSubscriptionQuery } from "../../app/services/stripe";
import Header from "../Header";
import Background from "../ui/background";

type Props = {};

type ContextType = {
  plan: string | null;
};

const Layout = (props: Props) => {
  const user = useAppSelector(selectCurrentUser) as AuthState;
  const { data } = useRetrieveSubscriptionQuery(
    { username: user.user.username },
    {
      skip: !user.user.username,
    },
  );
  // const plan = data?.subscription?.data[0].plan.metadata.name;

  const plan = "pro";
  
  return (
    <div className="">
      <Header isActive={false} user={user} plan={plan} />
      <main className="pt-16">
        <Outlet context={{ plan } as ContextType} />
      </main>
      <Background />
    </div>
  );
};

export function useUserPlan() {
  return useOutletContext<ContextType>();
}
export default Layout;
