import React, { ChangeEvent, useState } from 'react';
import InputForm from '../components/InputForm';

interface UserInterface {
    name: string;
    email: string;
    password: string;
};

const Register = () => {
    const [ userInfo, setUserInfo ] = useState<UserInterface>({ name: '', email: '', password: '' });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserInfo({...userInfo, [event.target.name] : event.target.value })
    };

  return (
    <div className='w-4/12 flex flex-col items-center'>
        <h2 className='text-2xl text-white'>Register</h2>
        <form 
            action=""
            className='w-full flex flex-col gap-4 mt-8 bg-blue-900 py-8 px-6 rounded-md'
        >
            <InputForm 
                name= 'name'
                type='text'
                placeholder = 'Name'
                value={userInfo.name}
                fn={handleChange}
            />
            <InputForm 
                name= 'email'
                type='text'
                placeholder = 'Email'
                value={userInfo.email}
                fn={handleChange}
            />
            <InputForm 
                name= 'password'
                type='password'
                placeholder = 'Password'
                value={userInfo.password}
                fn={handleChange}
            />

            <button
                className='bg-white p-2 mt-2 rounded-md border-none outline-none'
            >
                Sign Up
            </button>
        </form>
    </div>
  )
}

export default Register;