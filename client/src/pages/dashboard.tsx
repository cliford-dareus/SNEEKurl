import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hook';
import { useAddUrlMutation } from '../features/api';
import Header from '../components/Header';
import type { RootState } from '../app/store';

const Dashboard = () => {
    const user = useAppSelector((state) => state.user);
    const [ adduser, { data }] = useAddUrlMutation();
    const [ url, seturl ] = useState<string>('');
    const dispatch = useAppDispatch();

    const handleChange = (event: ChangeEvent<HTMLInputElement>)=> {
        seturl( event.target.value)
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        const body = url
        try {
            if(!body) return;
            await adduser(body);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        
    }, [])
    
  return (
    <div className='text-white h-full w-full'>
        <Header user={user}/>

        <div className='w-full p-4 sm:px-60'>
            <div className='my-8'>
                <span className=''></span>  
                <h1 className='text-3xl text-center sm:text-6xl'>Quickily and Reliably shortened and save your url for later!</h1>
            </div>

            <form className='w-full rounded-md flex flex-col items-center' onSubmit={onSubmit}>
                <input 
                    type="text" 
                    className='w-11/12 py-1 px-2 rounded-md bg-transparent outline-none border-b '
                    placeholder='Enter Url'
                    onChange={handleChange}
                />
                <button className='bg-blue-800 py-2 px-8 rounded-md mt-4'>Shorten</button>
            </form>

        </div>

        <div className='w-full p-4 sm:px-60'>
            <h3 className='text-xl'>Recents</h3>
            <div className='w-full flex gap-4 py-4'>
                <div className='w-1/2 h-48 bg-blue-800 rounded-md p-4'>
                    recents
                </div>
                <div className='w-1/2 h-48 bg-blue-800 rounded-md p-4'>
                    recents
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard;