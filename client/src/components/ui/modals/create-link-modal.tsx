import React, {Dispatch, SetStateAction} from 'react';
import {Sheet, SheetContent} from "../sheet";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import Label from "../label";
import Input from "../Input";
import {SubmitHandler, useForm} from "react-hook-form";
import Button from "../button";
import PasswordEditSection from "./password-edit-section";
import {useShortenUrlMutation} from "../../../app/services/urlapi";

type  Props = {
    setAddLinkActive: Dispatch<SetStateAction<boolean>>;
    addLinkActive: boolean;
}

type CreateLinkProp = {
    longUrl: string;
    "back-half": string;
    password: string;
}
const CreateLinkModal = ({addLinkActive, setAddLinkActive}: Props) => {
    const [attemptShort] = useShortenUrlMutation();
    const {register,
        handleSubmit,
        setValue
    } = useForm<CreateLinkProp>()

    const handleCreateLink: SubmitHandler<CreateLinkProp> = async (dataform) => {
        console.log(dataform)
        try {
            await attemptShort(dataform);

        }catch (e) {

        }
    };

    return (
        <>
            {addLinkActive &&
                <>
                    <Sheet triggerFn={setAddLinkActive}/>
                    <SheetContent
                        classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
                        <div className="relative h-full w-[500px]">
                            <div
                                className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-slate-200 p-4">
                                <svg width="40"
                                     height="40"
                                     viewBox="0 0 200 250"
                                     fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                                          fill="black"/>
                                </svg>
                                <p>Creating new Link</p>
                            </div>

                            <form
                                action=""
                                className="h-full p-4 pt-20"
                                onSubmit={handleSubmit(handleCreateLink)}
                            >
                                <div className="flex flex-col gap-4 pt-4">
                                    <div>
                                        <Label>Destination Url</Label>
                                        <Input
                                            register={register}
                                            placeholder=""
                                            label="longUrl"
                                            hidden={false}
                                        />
                                    </div>

                                    <div>
                                        <Label>Short Url</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-full bg-white px-2 py-1">
                                                sneek.co/
                                            </div>
                                            <Input
                                                register={register}
                                                placeholder=""
                                                label="short"
                                                hidden={false}
                                            />
                                        </div>
                                    </div>
                                    <Button classnames="self-start">Create</Button>
                                </div>
                            </form>
                        </div>
                    </SheetContent>
                </>
            }
        </>
    )
};

export default CreateLinkModal;