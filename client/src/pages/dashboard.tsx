import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hook';
import { useAddUrlMutation, useGetUrlsQuery, useDeleteUrlMutation, useFavoriteUrlMutation, useVisitUrlQuery } from '../features/api';
import Header from '../components/Header';
import type { RootState } from '../app/store';

import { IoTrashBinOutline, IoHeartOutline, IoHeartSharp, IoArrowRedoOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const user = useAppSelector((state: RootState) => state.user);
    const [ addUrl ] = useAddUrlMutation();
    const [ favoriteShort ] = useFavoriteUrlMutation();
    const [ deleteUser] = useDeleteUrlMutation();
    const { data =[]} = useGetUrlsQuery({refetchOnMountOrArgChange: true});

    const [ url, seturl ] = useState<string>('');
    const dispatch = useAppDispatch();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>{
        seturl( event.target.value);
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const body = { full: url};

        try {
            if(!body) return;
            await addUrl(body);
            seturl('');
        } catch (error) {
            console.log(error);
        }
    };

    const deletefn =async (short: string) => {
        deleteUser(short);
    };

    const favoritefn = async (short: string) => {
        favoriteShort(short);
    };

    useEffect(() => {
        
    }, [data]);
    
  return (
    <div className='text-white h-full w-full flex flex-col justify-between'>
        <Header user={user}/>
        <div className='w-full h-5/6 flex flex-col gap-4 justify-between'>
            <div className='w-full flex flex-col p-4 md:w-1/2 md:px-0 md:mx-auto lg:w-2/6'>
                <div className=''>
                    <div className='my-16'>
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

            <div className='w-full h-1/2 p-4 rounded-md bg-blue-800 md:w-3/5 md:mx-auto md:px-4'>
                <h3 className='text-xl mb-4'>Recent URL</h3>
                { user.userId !== '' ? (
                    <div className='w-full h-full'>
                        <table className='w-full table-fixed'>
                            <thead>
                                <tr className='border-b'>
                                    <th className='w-8 text-left'>Full</th>
                                    <th className='w-8 text-left'>Short</th>
                                    <th className='w-4 text-left'>Visits</th>
                                    <th className='w-4'></th>
                                    <th className='w-4'></th>
                                    <th className='w-4'></th>
                                </tr>
                            </thead>

                            <tbody>
                                {data?.slice(0,6).map((site: any) => {
                                    return(
                                        <tr 
                                            key={site.short}
                                            className='overflow-hidden h-8 border-b hover:bg-blue-500'
                                        >
                                            <td className='w-8 truncate overflow-hidden'>{site.full}</td>
                                            <td className='w-8 truncate overflow-hidden'>{site.short}</td>
                                            <td className='w-2 px-2'>{site.clicks}</td>
                                            <td className='w-2'>
                                                <button
                                                    className='w-full h-full flex items-center justify-center' 
                                                    onClick={()=> deletefn(site.short)}
                                                >
                                                    <IoTrashBinOutline />
                                                </button>
                                            </td>
                                            <td className='w-2'>
                                                <button
                                                    className='w-full h-full flex items-center justify-center'
                                                    onClick={() => favoritefn(site.short)}
                                                >
                                                    {site.favorite? <IoHeartSharp /> : <IoHeartOutline/>}
                                                </button>
                                            </td>
                                            <td className='w-2'>
                                                <a 
                                                    className='w-full h-full flex items-center justify-center'
                                                    href={`http://localhost:4080/api/v1/short/${site.short}`} 
                                                    target='_blank'
                                                    data-original-title='null'
                                                >
                                                    <IoArrowRedoOutline />
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                       
                    </div>): 
                    (<div className='text-white h-full flex flex-col gap-4 justify-center items-center px-2 md:px-24'>
                        <p className='text-center text-xl'>Login to save and favorite you most use short URL</p>
                        <Link 
                            to='/login'
                            className='border px-8 py-1 rounded-md'
                        >
                            Login
                        </Link>
                    </div>
                ) }
            </div>
        </div>
    </div>
  )
};

export default Dashboard;