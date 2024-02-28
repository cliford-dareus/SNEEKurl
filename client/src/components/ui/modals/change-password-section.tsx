import React, {useEffect, useState} from 'react';
import Switch from "../switch";
import Input from "../Input";
import {UseFormRegister} from "react-hook-form";
import {Profile} from "../../profile";

type Props = {
    register: UseFormRegister<Profile | any>;
    setvalue: any;
}

const ChangePasswordSection = ({register, setvalue}: Props) => {
    const [enable, setEnable] = useState(false);

    useEffect(() => {
        if (!enable) {
            setvalue("oldpassword", null);
            setvalue('newpassword', null)
        }
    }, [enable]);

    return (
        <>
            <div className=''>
                <div className="mb-4 flex items-center justify-between">
                    <p className='font-medium'>Password</p>
                    <Switch
                        label="password"
                        isChecked={enable}
                        fn={setEnable}
                    />
                </div>

                {enable &&
                    <div className='rounded-lg bg-slate-200 p-4'>
                        <span className='font-medium'>Change password</span>
                        <div className='mt-4 flex flex-col gap-4'>
                            <div>
                                <p className=''>Old Password</p>
                                <Input
                                    register={register}
                                    label='oldpassword'
                                    placeholder=''
                                    hidden={false}
                                />
                            </div>

                            <div>
                                <p className=''>New Password</p>
                                <Input
                                    register={register}
                                    label='newpassword'
                                    placeholder=''
                                    hidden={false}
                                    type='password'
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};
export default ChangePasswordSection;