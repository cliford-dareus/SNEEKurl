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
                <div className="flex justify-between items-center mb-4">
                    <p className='font-medium'>Password</p>
                    <Switch
                        isChecked={enable}
                        fn={setEnable}
                    />
                </div>

                {enable &&
                    <div className='bg-slate-200 rounded-lg p-4'>
                        <span className='font-medium'>Change password</span>
                        <div className='flex flex-col gap-4 mt-4'>
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