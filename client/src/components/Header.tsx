import React from 'react';
import { UserInterface } from '../features/userSlice';

const Header = ({ user }:any) => {

  return (
    <header className='w-full text-white p-4 flex justify-between items-center border-b sm:px-12'>
        <span className='rounded-full bg-white text-blue-800 p-1 text-xl'>SNEEK<i>URL</i></span>

        <nav className='w-1/2 absolute right-1/2 translate-x-1/2 top-20'>
          <ul className='flex flex-col gap-4 justify-center items-center bg-blue-800 p-4'>
            <li className='text-xl'>Recent</li>
            <li className='text-xl'>Favorite</li>
          </ul>
        </nav>

        <div className='flex gap-2 items-center'>
            <p className='text-sm'>Welcome,<br/>{user.name}</p>
            <span className='rounded-full bg-white w-10 h-10 inline-block'></span>
        </div>
    </header>
  )
}

export default Header;