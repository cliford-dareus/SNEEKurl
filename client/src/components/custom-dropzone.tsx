import React, {SetStateAction, useEffect} from 'react';
import {UseFormSetValue} from "react-hook-form";
import {FileProps, FileWithPreview} from "./ui/modals/change-profile-image-modal";

type Props = {
    fileData: FileWithPreview[] | null;
    setValue: UseFormSetValue<FileProps>;
    setFileData: React.Dispatch<SetStateAction<FileWithPreview[] | null>>;
}

const FILETYPEACCEPTED = ['image/jpg', 'image/png', 'image/jpeg'];

const CustomDropzone = ({ fileData, setValue, setFileData}: Props) => {
    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();

        const files = event.dataTransfer.files

        if (files && files.length > 0) {
            const file = files[0];
            const fileSize = files[0].size;
            const fileType = files[0].type;

            if (fileSize > 1024 * 1024 * 2 && !FILETYPEACCEPTED.includes(fileType)) {
                console.log('Image is to big')
                return
            }

            const fileUrl = URL.createObjectURL(file)
            const fileWithPreview = Object.assign(file,{preview: fileUrl})
            setFileData(prevState => [...(prevState ?? []), fileWithPreview])
        }
    }

    useEffect(() => {
        setValue('image', fileData as File[])
    }, [fileData]);

    useEffect(() => {
        return () => {
            if(!fileData) return;
            fileData.forEach(files =>
                URL.revokeObjectURL(files.preview)
            )
        }
    }, []);

    return (
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
            className='relative z-20 mt-4 flex w-full items-center justify-center border border-dashed border-slate-300 h-[200px]'
        >
            <p>Drag and Drop Image Here...</p>
        </div>
    )
};

export default CustomDropzone;