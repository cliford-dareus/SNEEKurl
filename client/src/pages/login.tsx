import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useLoginUserMutation } from '../features/api';
import InputForm from '../components/InputForm';

interface UserInterface {
    name: string;
    password: string;
};

const Login = () => {
    const [ loginUser, { data }] = useLoginUserMutation();
    const [ userInfo, setUserInfo ] = useState<UserInterface>({ name: '', password: '' });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserInfo({...userInfo, [event.target.name] : event.target.value })
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { name, password } = userInfo;

        if(!name || !password){
            console.log('Please provide an email and password')
            return (<h1 className='text-white bg-white w-full absolute h-11'>Please provide an email and password</h1>)
        };
        
        const body = { name, password };

        try {
            loginUser(body);
            setUserInfo({ name: '', password: '' });
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='w-4/12 flex flex-col items-center'>
        <h2 className='text-2xl text-white'>Login</h2>
        <form 
            action=""
            className='w-full flex flex-col gap-4 mt-8 bg-blue-900 py-8 px-6 rounded-md'
            onSubmit={onSubmit}
        >
            <InputForm 
                name= 'name'
                type='text'
                placeholder = 'Name'
                value={userInfo.name}
                fn={handleChange}
            />
            <InputForm 
                name= 'password'
                type='text'
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