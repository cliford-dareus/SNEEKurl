import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

type Props = {}

const Layout = (props: Props) => {
  return (
    <div className='relative'>
        <Header/>
        <main className='pt-16'>
            {<Outlet/>}
        </main>
    </div>
  )
}

export default Layout