import React, {Dispatch, SetStateAction} from 'react';
import {Sheet, SheetContent} from "../sheet";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import Label from "../label";
import Input from "../Input";
import {SubmitHandler, useForm} from "react-hook-form";
import Button from "../button";

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
    const {register, handleSubmit} = useForm<CreateLinkProp>()

    const handleCreateLink: SubmitHandler<CreateLinkProp> = async (dataform) => {
        console.log(dataform)
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
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                                        "https://www.notion.so/42ccaebd5905427b847a1c0b4db3882e?v=6b1a83d2d07743c4837422b34e513239"
                                    )}`}
                                    className="w-[30px]"
                                    alt=""
                                />
                                <p>Creating new Link</p>
                            </div>

                            <form
                                action=""
                                className="flex h-full flex-col gap-4 p-4 pt-20"
                                onSubmit={() => {
                                }}
                            >
                                <div>
                                    <Label>Destination Url</Label>
                                    <Input
                                        register={register}
                                        placeholder=""
                                        label="longUrl"
                                        hidden={false}
                                    />
                                </div>

                                <Button classnames="self-start">Create</Button>
                            </form>
                        </div>
                    </SheetContent>
                </>
            }
        </>
    )
};

export default CreateLinkModal;