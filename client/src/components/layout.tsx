import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

type Props = {}

const Layout = (props: Props) => {
  return (
    <div className='w-full h-full relative'>
        <Header/>
        <div className='w-full h-full overflow-hidden'>
            {<Outlet/>}
        </div>
    </div>
  )
}

export default Layout