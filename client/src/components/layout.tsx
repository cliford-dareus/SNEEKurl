import Header from './Header'
import {Outlet, useOutletContext} from 'react-router-dom'
import {useRetrieveSubscriptionQuery} from "../app/services/stripe";

type Props = {}

type  ContextType = {
    plan: string | null
}

const Layout = (props: Props) => {
    const {data} = useRetrieveSubscriptionQuery();
    const plan = data?.subscription?.data[0].plan.metadata.name;

    return (
        <div className=''>
            <Header isActive={false}/>
            <main className='pt-16'>
                <Outlet context={{plan} as ContextType}/>
            </main>
        </div>
    )
}

export function useUserPlan() {
    return useOutletContext<ContextType>();
}
export default Layout