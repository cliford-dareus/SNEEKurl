import React, {Dispatch, SetStateAction} from 'react';
import {Sheet, SheetContent} from "../sheet";

type  Props = {
    setAddLinkActive: Dispatch<SetStateAction<boolean>>;
    addLinActive: boolean;
}
const CreateLinkModal = ({addLinActive, setAddLinkActive}: Props) => {
    return (
        <>
            {addLinActive &&
                <>
                    <Sheet triggerFn={setAddLinkActive}/>
                    <SheetContent classnames="bg-red-600 top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
                        <p>Picture</p>
                    </SheetContent>
                </>
            }
        </>
    )
};

export default CreateLinkModal;