import React, {useEffect, useState} from 'react';
import Switch from "../switch";
import Input from "../Input";
import {UseFormRegister} from "react-hook-form";
import {Profile} from "../../profile";

type Props = {
    register: UseFormRegister<Profile | any>;
    setvalue: any;
}

const  ChangePasswordSection = ({register, setvalue}: Props) => {
    const  [enable, setEnable] = useState(false);

    useEffect(() => {
        if(!enable){
            setvalue("oldpassword", null);
            setvalue('newpassword', null)
        }
    }, [enable]);

    return (
        <>
        <div className=''>
            <div className="flex justify-between items-center">
                <p>Password</p>
                <Switch
                    isChecked={enable}
                    fn={setEnable}
                />
            </div>


            {enable &&
                <>
                    <span>Change password</span>
                    <>
                        <p>Old Password</p>
                        <Input
                            register={register}
                            label='oldpassword'
                            placeholder=''
                            hidden={false}
                        />
                    </>

                    <>
                        <p>New Password</p>
                        <Input
                            register={register}
                            label='newpassword'
                            placeholder=''
                            hidden={false}
                            type='password'
                        />
                    </>


                </>

            }
        </div>
        </>
    );
};
export default ChangePasswordSection;