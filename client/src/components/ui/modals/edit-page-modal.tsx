import React, {Dispatch, SetStateAction, useState} from 'react';
import {Sheet, SheetContent} from "../sheet";
import MultiSelect from "../multi-select";
import Input from "../Input";
import Label from "../label";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateLinkInBioProp} from "./create-link-in-bio-modal";
import Switch from "../switch";
import Button from "../button";
import {useUpdatePageMutation} from "../../../app/services/page";


type Props = {
    editPageActive: boolean;
    setEditPageActive: Dispatch<SetStateAction<boolean>>;
    page: any;
}

interface UpdateLinkInBioProps extends CreateLinkInBioProp{
    links: string[];
}
const EditPageModal = ({editPageActive, setEditPageActive, page}: Props) => {
    const [updatePage] = useUpdatePageMutation();
    const [isChecked, setChecked] = useState(page.isPublic);
    const {register,
        handleSubmit,
        setValue
    }
        = useForm<UpdateLinkInBioProps>({
        defaultValues: {
            title: page.title,
            description: page.description,
            slug: page.slug,
            public: page.public,
            links: []
        }
    });

    const handleUpdatePage: SubmitHandler<UpdateLinkInBioProps> = async (dataform) => {
        console.log(dataform)
        try {
            await updatePage({
                id: page._id,
                title: dataform.title,
                description: dataform.description,
                slug: dataform.slug,
                isPublic: dataform.public,
                links: dataform.links
            }).unwrap();
            setEditPageActive(false);
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            {
                editPageActive &&
                <>
                    <Sheet triggerFn={setEditPageActive}/>
                    <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
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
                                <p>Editing Page</p>
                            </div>

                            <form
                                action=""
                                className="h-full p-4 pt-20"
                                onSubmit={handleSubmit(handleUpdatePage)}
                            >
                                <div className="flex flex-col gap-4 pt-8">
                                    <div>
                                        <Label>Title</Label>
                                        <Input
                                            register={register}
                                            placeholder=""
                                            label="title"
                                            hidden={false}
                                        />
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Input
                                            register={register}
                                            placeholder=""
                                            label="description"
                                            hidden={false}
                                        />
                                    </div>

                                    <div>
                                        <Label>Slug</Label>
                                        <Input
                                            register={register}
                                            placeholder=""
                                            label="slug"
                                            hidden={false}
                                        />
                                    </div>

                                    <MultiSelect  setvalues={setValue} />

                                    <div className="flex items-center justify-between">
                                        <p>Public</p>
                                        <Switch
                                            isChecked={isChecked}
                                            fn={setChecked}
                                            label={'public'}
                                            register={register}
                                        />
                                    </div>
                                    <Button classnames="self-start">Update</Button>
                                </div>
                            </form>
                        </div>
                    </SheetContent>
                </>
            }
        </>
    )
};

export default EditPageModal;