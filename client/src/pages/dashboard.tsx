import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hook';
import { useAddUrlMutation, useGetUrlsQuery } from '../features/api';
import Header from '../components/Header';
import type { RootState } from '../app/store';

const Dashboard = () => {
    const user = useAppSelector((state: RootState) => state.user);
    const [ adduser, { data: userDate }] = useAddUrlMutation();
    const { data =[] , isLoading, isError, refetch } = useGetUrlsQuery({refetchOnMountOrArgChange: true});
    const [ url, seturl ] = useState<string>('');
    const dispatch = useAppDispatch();

    const handleChange = (event: ChangeEvent<HTMLInputElement>)=> {
        seturl( event.target.value)
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        const body = { full: url};

        try {
            if(!body) return;
            await adduser(body);
            seturl('');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
    }, [data]);
    
  return (
    <div className='text-white h-full w-full flex flex-col justify-between'>
        <Header user={user}/>
        <div className='w-full h-5/6 flex flex-col gap-4 justify-between'>
            <div className='w-full flex flex-col p-4 lg:px-96 xl:w-1/2 xl:px-4 xl:mx-auto'>
                <div className=''>
                    <div className='my-8'>
                        <span className=''></span>  
                        <h1 className='text-3xl text-center sm:text-4xl'>Quickily and Reliably shortened and save your url for later!</h1>
                    </div>

                    <form className='w-full rounded-md flex flex-col items-center' onSubmit={onSubmit}>
                        <input 
                            type="text" 
                            className='w-11/12 py-1 px-2 rounded-md bg-transparent outline-none border-b '
                            placeholder='Enter Url'
                            value={url}
                            onChange={handleChange}
                        />
                        <button className='bg-blue-800 py-2 px-8 rounded-md mt-4'>Shorten</button>
                    </form>
                </div>
            </div>

            <div className='w-full h-2/5 p-4 rounded-md bg-blue-800 md:w-3/4 md:mx-auto md:px-4'>
                { data.length > 0 ? (
                    <div>
                        {
                            data.map((item:any) => {
                                return(
                                    <p>{item.full}</p>
                                )
                            })
                        }
                    </div>): 
                    (<h3 className='text-white'>Loadind...</h3>
                ) }
            </div>
        </div>
    </div>
  )
}

export default Dashboard;