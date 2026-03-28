import React, {Dispatch, SetStateAction, useState} from "react";
import {Url} from "../../app/services/urlapi";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from "../ui/dialog";
import {getSiteUrl} from "../../Utils/getSiteUrl";
import Button from "../ui/button";
import Input from "../ui/Input";

type Props = {
    status: boolean;
    url: Url | null;
    setStatus: Dispatch<SetStateAction<{ status: boolean; url: Url | null }>>;
};

const VisitLinkPassword = ({status, url, setStatus}: Props) => {
    const {handleSubmit, reset} = useForm<{ password: "" }>(
        {
            defaultValues: {
                password: "",
            },
        }
    );

    const onsubmit: SubmitHandler<{ password: string }> = async (formdata) => {
        const {password} = formdata;
        window.open(
            `http://localhost:4080/short/${url?.short}?password=${password}`
        );
    };

    const handledSetStatus = (newStatus: boolean) => {
        setStatus({status: newStatus, url: url});
    };

    return (
        <Dialog open={status} onOpenChange={handledSetStatus}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 200 250"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                                fill="currentColor"
                            />
                        </svg>
                        <div>
                            <DialogTitle>Visit Link</DialogTitle>
                            <DialogDescription>Enter the password to visit the link</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="px-6 py-4">
                    <form
                        className="mt-4 flex h-full gap-4 p-4 pt-20"
                        onSubmit={handleSubmit(onsubmit)}
                    >
                        <label className="block text-sm text-zinc-400 ml-1">Password</label>
                        <Controller
                            name="password"
                            render={({field}) => (
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="Enter password"
                                    className='w-full rounded-full border border-base-300 px-4 py-1 text-black'
                                />
                            )}
                        />
                    </form>
                </div>

                <DialogFooter className="px-6 py-4">
                    <button
                        type="submit"
                        onClick={handleSubmit(onsubmit)}
                        className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Visit Link
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default VisitLinkPassword;
