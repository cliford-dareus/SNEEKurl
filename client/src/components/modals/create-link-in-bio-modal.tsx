import React, {Dispatch, SetStateAction, useState} from "react";
import Label from "../ui/label";
import Input from "../ui/Input";
import {Button} from "../ui/button";
import Switch from "../ui/switch";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useCreatePageMutation} from "../../app/services/page";
import {toast} from "react-toastify";
import {Dialog,DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from "../ui/dialog";

type Props = {
    createLinkInBioActive: boolean;
    setCreateLinkInBioActive: Dispatch<SetStateAction<boolean>>;
};

export type CreateLinkInBioProp = {
    title: string;
    description: string;
    slug: string;
    public: boolean;
};
const CreateLinkInBioModal = ({
                                  createLinkInBioActive,
                                  setCreateLinkInBioActive,
                              }: Props) => {
    const [createLinkInBio] = useCreatePageMutation();
    const [isChecked, setChecked] = useState(false);
    const {register, handleSubmit, reset, control} = useForm<CreateLinkInBioProp>();

    const handleCreateLinkInBio: SubmitHandler<CreateLinkInBioProp> = async (
        dataform
    ) => {
        try {
            await createLinkInBio(dataform).unwrap();
            toast.success("Page created successfully");
            setCreateLinkInBioActive(false);
            reset();
        } catch (e) {
            toast.error("Page creation failed");
        }
    };

    return (
        <Dialog open={createLinkInBioActive} onOpenChange={setCreateLinkInBioActive}>
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
                            <DialogTitle>Create New Link</DialogTitle>
                            <DialogDescription className="text-zinc-400">Shorten your URL and customize it</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="px-6 py-4">
                    <form onSubmit={handleSubmit(handleCreateLinkInBio)}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label classnames="block text-sm text-zinc-400 mb-1 ml-1">Title</Label>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter a title"
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <Label classnames="block text-sm text-zinc-400 mb-1 ml-1">Description</Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter a description"
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <Label classnames="block text-sm text-zinc-400 mb-1 ml-1">Slug</Label>
                                <Controller
                                    name="slug"
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter a slug"
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="block text-sm text-zinc-400 mb-1 ml-1">Public</p>
                                <Switch
                                    isChecked={isChecked}
                                    fn={setChecked}
                                    label={"public"}
                                    register={register}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter>
                    <button
                        type="submit"
                        onClick={handleSubmit(handleCreateLinkInBio)}
                        className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Create Page
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateLinkInBioModal;
