import { useWindowSize, Size } from '../Utils/windowSize';
import { Link } from 'react-router-dom';
import { IoMoon, IoMoonOutline } from 'react-icons/io5';
import { UserInterface } from '../features/userSlice';

const Header = ({ user }:{ user: UserInterface }) => {
  const size: Size = useWindowSize();
  const isMobile = size.width! < 768;
 
  return (
    <header className='w-full text-white p-4 flex justify-between items-center border-b sm:px-12'>
        <span className='text-white text-xl lg:text-5xl font-bold'>SNEEK<i className='text-blue-600'>URL</i></span>

        <nav className={`${isMobile ? 'w-1/2 absolute h-1 hover:h-auto overflow-hidden right-1/2 translate-x-1/2 top-20': ''}`}>
          <ul className={`${isMobile? 'flex flex-col gap-4 justify-center items-center bg-blue-800 p-4': 'md:flex md:gap-4'}`}>
            <li className='text-xl uppercase'> 
              <Link to='/recent'>Recent</Link>
            </li>
            <li className='text-xl uppercase'>
              <Link to='/favorite'>Favorite</Link>
            </li>
          </ul>
        </nav>

        <div className='flex gap-4 items-center'>
            <div className='flex items-center mr-2'>
              <span className='hidden'><IoMoon /></span>
              <span className=''><IoMoonOutline /></span>
            </div>
            <p className='text-sm lg:text-lg'>Welcome,{user? <span className='font-bold ml-2'>{user.name}</span> : <span className='text-white'>Guest</span>}</p>
            <span className='rounded-full bg-white w-10 h-10 inline-block'></span>
        </div>
    </header>
  )
}

export default Header;