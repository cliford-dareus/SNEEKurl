import React, {Dispatch, SetStateAction, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "../dialog";
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
                    <Dialog open={editProfileActive} onOpenChange={setEditProfileActive}/>
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
                                    <DialogDescription>Shorten your URL and customize it</DialogDescription>
                                </div>
                                </div>
                            </DialogHeader>

                        <div className="px-6 py-4">
                            <form
                                action=""
                                className="h-full gap-4 p-4 pt-20"
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
                                <Button classnames="bg-primary">Update</Button>
                            </form>
                        </div>
                    </DialogContent>
                </>
            }

        </>
    )
};

export default ChangeProfileImageModal;
