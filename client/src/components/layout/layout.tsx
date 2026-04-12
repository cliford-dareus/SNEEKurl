import {Outlet, useOutletContext} from "react-router-dom";
import {useAppSelector} from "../../app/hook";
import {AuthState, selectCurrentUser} from "../../features/auth/authslice";
import {useRetrieveSubscriptionQuery} from "../../app/services/stripe";
import Header from "../Header";
import Background from "../ui/background";

type Props = {};

type ContextType = {
    plan: string | null;
};

const Layout = (props: Props) => {
    const user = useAppSelector(selectCurrentUser) as AuthState;
    const {data} = useRetrieveSubscriptionQuery(
        {username: user.user.username},
        {
            skip: !user.user.username,
        },
    );
    const plan = data?.subscription?.data[0]?.plan.metadata.name ?? "free";

    return (
        <div className="w-full h-full bg-[radial-gradient(circle,rgba(2,_0,_36,_0)_0%,#fafafa_100%)] dark:bg-[radial-gradient(circle,rgba(2,_0,_36,_0)_0%,#010101_100%)]">
            <Header isActive={false}  plan={plan}/>
            <main className="pt-15">
                <Outlet context={{plan} as ContextType}/>
            </main>
            <Background/>
        </div>
    );
};

export function useUserPlan() {
    return useOutletContext<ContextType>();
}

export default Layout;
