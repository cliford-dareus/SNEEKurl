import React, {useState} from "react";
import {useAppSelector} from "../app/hook";
import {RootState} from "../app/store";
import {useRetrieveSubscriptionQuery} from "../app/services/stripe";
import {SubmitHandler, useForm} from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/button";
import ChangePasswordSection from "./ui/modals/change-password-section";
import Separator from "./ui/separator";
import {Outlet} from "react-router-dom";
import Portal from "./portal";
import ChangeProfileImageModal from "./ui/modals/change-profile-image-modal";


export type Profile = {
    username: string;
    email: string;
    oldpassword: string;
    newpassword: string;
}
const Profile = () => {
    const user = useAppSelector((state: RootState) => state.auth);
    const {data} = useRetrieveSubscriptionQuery();
    const plan = data?.subscription?.data[0].plan.metadata.name;
    const [editProfileActive, setEditProfileActive] = useState(false)

    const {
        register,
        handleSubmit,
        setValue
    } = useForm<Profile>({
        defaultValues: {
            username: user.user.username,
            email: '',
            oldpassword: '',
            newpassword: ''
        }
    });

    const handleChangeprofiledetails: SubmitHandler<Profile> = async (dataform: Profile) => {
        console.log(dataform)
    }

    return (
        <>
            <section>
                <div className="px-1">
                    <div>
                        {/*<h2 className='font-bold'>Profile</h2>*/}
                        <div className='flex gap-16'>
                            <p>Profile Image</p>

                            <div className='flex-1 flex items-center justify-between'>
                                <div className='w-[50px] h-[50px] rounded-full bg-red-500'>
                                    <img src="/../assets/react.svg" alt="Your profile image"/>
                                </div>

                                <div className='flex gap-4 items-center'>
                                    <Button
                                        onClick={() => setEditProfileActive(true)}
                                        classnames=''
                                    >Upload new</Button>
                                    <Button classnames='bg-transparent'>Delete</Button>
                                </div>
                            </div>

                        </div>

                        <Separator/>

                        <form
                            className="mt-4 flex flex-col gap-4"
                            onSubmit={handleSubmit(handleChangeprofiledetails)}
                        >


                            <>
                                <p>Username</p>
                                <Input
                                    register={register}
                                    label='username'
                                    hidden={false}
                                    placeholder=''
                                />
                            </>

                            <>
                                <p>Email</p>
                                <Input
                                    register={register}
                                    label='email'
                                    hidden={false}
                                    placeholder=''
                                />
                            </>

                            <ChangePasswordSection
                                register={register}
                                setvalue={setValue}
                            />

                            <Button classnames='self-start'>Save</Button>
                        </form>
                    </div>
                    <Separator/>
                    <div className=''>

                    </div>
                </div>

                <Portal>
                    <ChangeProfileImageModal
                        editProfileActive={editProfileActive}
                        setEditProfileActive={setEditProfileActive}
                    />
                </Portal>
            </section>

        </>
    );
};

export default Profile;
