import React, {Dispatch, SetStateAction, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "../ui/dialog";
import MultiSelect from "../ui/multi-select";
import Input from "../ui/Input";
import Label from "../ui/label";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {CreateLinkInBioProp} from "./create-link-in-bio-modal";
import Switch from "../ui/switch";
import Button from "../ui/button";
import {useUpdatePageMutation} from "../../app/services/page";
import {toast} from "react-toastify";
import {BsSave} from "react-icons/bs";

type Props = {
    editPageActive: boolean;
    setEditPageActive: Dispatch<SetStateAction<{ state: boolean; id: string }>>;
    page: any;
};

interface UpdateLinkInBioProps extends CreateLinkInBioProp {
    links: any[];
}

const EditPageModal = ({editPageActive, setEditPageActive, page}: Props) => {
    const [updatePage] = useUpdatePageMutation();
    const [isChecked, setChecked] = useState(page.isPublic);
    const {register, control, handleSubmit, setValue} = useForm<UpdateLinkInBioProps>({
        defaultValues: {
            title: page.title,
            description: page.description,
            slug: page.slug,
            public: page.public,
            links: [],
        },
    });

    const handleUpdatePage: SubmitHandler<UpdateLinkInBioProps> = async (
        dataform
    ) => {
        console.log(dataform);
        try {
            await updatePage({
                id: page._id,
                title: dataform.title,
                description: dataform.description,
                slug: dataform.slug,
                isPublic: dataform.public,
                links: dataform.links,
            }).unwrap();
            toast.success("Page updated successfully");
            setEditPageActive({state: false, id: ""});
        } catch (e) {
            toast.error("Page update failed");
            console.log(e);
        }
    };

    const handleSetEditPageActive = (newState: boolean) => {
        setEditPageActive({state: newState, id: ""});
    };

    return (
        <Dialog open={editPageActive} onOpenChange={handleSetEditPageActive}>
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
                    <form
                        onSubmit={handleSubmit(handleUpdatePage)}
                    >
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label classnames="block text-xs text-zinc-400 mb-1 ml-1">Title</Label>
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
                                <Label classnames="block text-xs text-zinc-400 mb-1 ml-1">Description</Label>
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
                                <Label classnames="block text-xs text-zinc-400 mb-1 ml-1">Slug</Label>
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

                            <MultiSelect setvalues={setValue}/>

                            <div className="flex items-center justify-between">
                                <p className="block text-xs text-zinc-400 mb-1 ml-1">Public</p>
                                <Switch
                                    isChecked={isChecked}
                                    fn={setChecked}
                                    label={"public"}
                                    register={register}
                                />
                            </div>
                            <button className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <BsSave className="w-5 h-5"/>
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditPageModal;
