import React from 'react'
import { useAppSelector } from '../app/hook';
import { RootState } from '../app/store';
import Header from '../components/Header';

const Recent = () => {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    <div className='text-white w-full h-full'>
      <Header user={user}/>
      recent
    </div>
  )
}

export default Recent;