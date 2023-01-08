import React, { ChangeEvent, useState } from 'react';
import InputForm from '../components/InputForm';

interface UserInterface {
    email: string;
    password: string;
};

const Login = () => {
    const [ userInfo, setUserInfo ] = useState<UserInterface>({ email: '', password: '' });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserInfo({...userInfo, [event.target.name] : event.target.value })
    };

  return (
    <div className='w-4/12 flex flex-col items-center'>
        <h2 className='text-2xl text-white'>Login</h2>
        <form 
            action=""
            className='w-full flex flex-col gap-4 mt-8 bg-blue-900 py-8 px-6 rounded-md'
        >
            <InputForm 
                name= 'email'
                placeholder = 'Email'
                value={userInfo.email}
                fn={handleChange}
            />
            <InputForm 
                name= 'password'
                placeholder = 'Password'
                value={userInfo.password}
                fn={handleChange}
            />

            <button
                className='bg-white p-2 mt-2 rounded-md border-none outline-none'
            >
                Sign In
            </button>
        </form>
    </div>
  )
}

export default Login;