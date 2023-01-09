import React from 'react';
import { UserInterface } from '../features/userSlice';

const Header = ({ user }:any) => {

  return (
    <header className='w-full text-white p-4 flex justify-between items-center border-b'>
        <span className='rounded-full bg-white text-blue-800 p-1 text-xl'>SNEEK<i>URL</i></span>
        <div className='flex gap-2 items-center'>
            <p className='text-sm'>Welcome,<br /> {user.name}</p>
            <span className='rounded-full bg-white w-10 h-10 inline-block'></span>
        </div>
    </header>
  )
}

export default Header;