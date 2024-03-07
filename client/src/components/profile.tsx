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
import {useUpdateUserDetailsMutation} from "../app/services/user";


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
    const [updateUserDetails] = useUpdateUserDetailsMutation();

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
        try {
            const updatedUser = await updateUserDetails({
                username: dataform.username,
                email: dataform.email,
                oldpassword: dataform.oldpassword,
                newpassword: dataform.newpassword
            }).unwrap();
        } catch (err) {

        }
    }

    return (
        <>
            <section>
                <>
                    <div>
                        {/*<h2 className='font-bold'>Profile</h2>*/}
                        <div className='flex gap-4 rounded-md border border-slate-200 px-4 py-8'>
                            <p className='font-medium'>Profile Image</p>
                            <div className='flex flex-1 items-center justify-between'>
                                <div className='rounded-full bg-red-500 w-[50px] h-[50px]'>
                                    <img src="/../assets/react.svg" alt=""/>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <Button
                                        onClick={() => setEditProfileActive(true)}
                                        classnames=''
                                    >Upload new</Button>
                                    <Button classnames='bg-white'>Delete</Button>
                                </div>
                            </div>
                        </div>

                        <Separator/>
                        <form
                            className="mt-4 flex flex-col gap-4 rounded-md border border-slate-200 p-4"
                            onSubmit={handleSubmit(handleChangeprofiledetails)}
                        >
                            <div>
                                <p className='font-medium'>Username</p>
                                <Input
                                    register={register}
                                    label='username'
                                    hidden={false}
                                    placeholder=''
                                />
                            </div>
                            <div>
                                <p className='font-medium'>Email</p>
                                <Input
                                    register={register}
                                    label='email'
                                    hidden={false}
                                    placeholder=''
                                />
                            </div>
                            <ChangePasswordSection
                                register={register}
                                setvalue={setValue}
                            />
                            <Button classnames='self-start px-5'>Save</Button>
                        </form>
                    </div>
                    <Separator/>
                    <div className=''>

                    </div>
                </>

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
