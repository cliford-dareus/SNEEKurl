import { useWindowSize, Size } from '../Utils/windowSize';
import { Link } from 'react-router-dom';

const Header = ({ user }:any) => {
  const size: Size = useWindowSize();
  const isMobile = size.width! < 768;
 
  return (
    <header className='w-full text-white p-4 flex justify-between items-center border-b sm:px-12'>
        <span className='rounded-full bg-white text-blue-800 p-1 text-xl'>SNEEK<i>URL</i></span>

        <nav className={`${isMobile ? 'w-1/2 absolute h-1 hover:h-auto overflow-hidden right-1/2 translate-x-1/2 top-20': ''}`}>
          <ul className={`${isMobile? 'flex flex-col gap-4 justify-center items-center bg-blue-800 p-4': 'md:flex md:gap-4'}`}>
            <li className='text-xl'> 
              <Link to='/recent'>Recent</Link>
            </li>
            <li className='text-xl'>
              <Link to='/favorite'>Favorite</Link>
            </li>
          </ul>
        </nav>

        <div className='flex gap-2 items-center'>
            <p className='text-sm'>Welcome,<br/>{user? <p>{user.name}</p> : <p>Guest</p> }</p>
            <span className='rounded-full bg-white w-10 h-10 inline-block'></span>
        </div>
    </header>
  )
}

export default Header;