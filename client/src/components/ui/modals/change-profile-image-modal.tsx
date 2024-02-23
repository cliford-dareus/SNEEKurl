import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Sheet, SheetContent} from "../sheet";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import Button from "../button";
import Separator from "../separator";
import {SubmitHandler, useForm} from "react-hook-form";
import {generateReactHelpers} from "@uploadthing/react/hooks";

type Props = {
    editProfileActive: boolean;
    setEditProfileActive: Dispatch<SetStateAction<boolean>>;
}

type FileProps = {
    image: File[]
}

const FILETYPEACCEPTED = ['image/jpg', 'image/png', 'image/jpeg'];

const { useUploadThing } = generateReactHelpers({url: 'http://localhost:4080/api/uploadthing'})

const ChangeProfileImageModal = ({
    editProfileActive,
    setEditProfileActive
}: Props) => {
    const { startUpload, isUploading}= useUploadThing("videoAndImage", {})
    const {handleSubmit, setValue} = useForm<FileProps>()
    const [image, setImage] = useState();
    const [fileData, setFileData] = useState<File[] | null>(null);
    const [preview, setPreview ] = useState('')

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();

        const files = event.dataTransfer.files

        if(files && files.length > 0){
            const file = files[0];
            const fileSize = files[0].size;
            const fileType = files[0].type;

            if(fileSize > 1024 * 1024 * 2 && !FILETYPEACCEPTED.includes(fileType)){
                console.log('Image is to big')
                return
            }

            const fileUrl = URL.createObjectURL(file)
            setPreview(fileUrl)
            setFileData(prevState => [...(prevState ?? []), file])
        }
    }

    const handleProfileChange: SubmitHandler<FileProps> = async (fileData) => {
        const image = await  startUpload(fileData.image).then((res) => {
            const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.key.split("_")[1] ?? image.key,
                url: image.url,
            }));
            return formattedImages ?? null;
        })

        // Add the url to the server
    }

    useEffect(() => {
        setValue('image', fileData as File[])
    }, [fileData]);

    return(
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
                                    src={`http://www.google.com/s2/favicons?domain=${getSiteUrl("https://www.notion.so/42ccaebd5905427b847a1c0b4db3882e?v=6b1a83d2d07743c4837422b34e513239")}`}
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
                                <div
                                    onDrop={onDrop}
                                    onDragOver={(event) => {
                                        event.stopPropagation()
                                        event.preventDefault()
                                    }}
                                    onDragEnter={(event) => {
                                        event.stopPropagation()
                                        event.preventDefault()
                                    }}
                                    className='mt-4 w-full border border-dashed border-slate-300 h-[100px] flex items-center justify-center'
                                >
                                    <p>Drag and Drop Image Here...</p>
                                </div>
                                <Separator/>
                                <div>
                                    <input type='file'/>
                                </div>
                                <Button>Update</Button>
                            </form>
                        </div>

                        <div className='w-[300px] h-[200px]'>
                            <img src={preview} alt="image"/>
                        </div>
                    </SheetContent>
                </>
            }

        </>
    )
};

export default ChangeProfileImageModal;