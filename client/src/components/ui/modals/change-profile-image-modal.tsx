import React, {Dispatch, SetStateAction, useState} from 'react';
import {Sheet, SheetContent} from "../sheet";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import Button from "../button";
import Separator from "../separator";
import {SubmitHandler, useForm} from "react-hook-form";
import {generateReactHelpers} from "@uploadthing/react/hooks";
import CustomDropzone from "../../custom-dropzone";
import {useUpdateUserProfileImageMutation} from "../../../app/services/user";

type Props = {
    editProfileActive: boolean;
    setEditProfileActive: Dispatch<SetStateAction<boolean>>;
}

export type FileProps = {
    image: File[]
}

export interface FileWithPreview extends File {
    preview: string
}


const {useUploadThing} = generateReactHelpers({url: 'http://localhost:4080/api/uploadthing'})

const ChangeProfileImageModal = ({
                                     editProfileActive,
                                     setEditProfileActive
                                 }: Props) => {
    const {startUpload, isUploading} = useUploadThing("videoAndImage", {})
    const {
        handleSubmit,
        setValue,
        reset
    } = useForm<FileProps>()
    const [fileData, setFileData] = useState<FileWithPreview[] | null>(null);
    const [updateProfileImage] = useUpdateUserProfileImageMutation();

    const handleProfileChange: SubmitHandler<FileProps> = async (formData) => {
        try {
            const image = Array.isArray(fileData) ?
                await startUpload(formData.image).then((res) => {
                    const formattedImages = res?.map((image) => ({
                        id: image.key,
                        name: image.key.split("_")[1] ?? image.key,
                        url: image.url,
                    }));
                    return formattedImages ?? null;
                }) : null

            await updateProfileImage(JSON.stringify(image));
            reset()
            setFileData(null)
        } catch (err) {
        }
    }

    return (
        <>
            {editProfileActive &&
                <>
                    <Sheet triggerFn={setEditProfileActive}/>
                    <SheetContent
                        classnames="bg-red-600 top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
                        <div className="w-[500px] h-full relative">
                            <div
                                className="w-full p-4 absolute top-0 left-0 right-0 bg-slate-200 rounded-tr-lg rounded-tl-lg flex flex-col justify-center items-center">
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${getSiteUrl("https://www.notion.so/42ccaebd5905427b847a1c0b4db3882e?v=6b1a83d2d07743c4837422b34e513239")}`}
                                    className="w-[30px]"
                                    alt=""
                                />
                                <p>Change Profile Picture</p>
                            </div>

                            <form
                                action=""
                                className="h-full pt-20 p-4 gap-4"
                                onSubmit={handleSubmit(handleProfileChange)}
                            >
                                <CustomDropzone
                                    fileData={fileData}
                                    setValue={setValue}
                                    setFileData={setFileData}
                                />

                                <Separator/>

                                <div>
                                    <input type='file'/>
                                </div>
                                <Button>Update</Button>
                            </form>
                        </div>
                    </SheetContent>
                </>
            }

        </>
    )
};

export default ChangeProfileImageModal;