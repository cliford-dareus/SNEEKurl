import Header from './Header'
import {Outlet, useOutletContext} from 'react-router-dom'
import {useRetrieveSubscriptionQuery} from "../app/services/stripe";
import Background from './ui/background';
import { useAppSelector } from '../app/hook';
import { RootState } from '../app/store';

type Props = {}

type  ContextType = {
    plan: string | null
}

const Layout = (props: Props) => {
    const user = useAppSelector((state: RootState) => state.auth);
    const { data } = useRetrieveSubscriptionQuery('', {skip: !user.user.username});
    // const plan = data?.subscription?.data[0].plan.metadata.name;
    
    const plan = 'pro'
    return (
        <div className=''>
            <Header isActive={false}/>
            <main className='pt-16'>
                <Outlet context={{plan} as ContextType}/>
            </main>
            <Background />
        </div>
    )
}

export function useUserPlan() {
    return useOutletContext<ContextType>();
}
export default Layout