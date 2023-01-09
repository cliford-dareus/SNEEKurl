import React from 'react'
import { useAppSelector } from '../app/hook';
import Header from '../components/Header';
import type { RootState } from '../app/store';

const Dashboard = () => {
    const user = useAppSelector((state) => state.user);

  return (
    <div className='text-white h-full w-full'>
        <Header user={user}/>
        <div className='w-full'>
            <div>
                <form action="">
                    <input type="text" />
                </form>
            </div>
        </div>
    </div>
  )
}

export default Dashboard;