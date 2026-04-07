import React from "react";
import {Button} from "../../../ui/button";
import {useEditor} from "../../../../hooks/use-editor";
import {useUpdatePageMutation} from "../../../../app/services/page";

const EditorTopbar = () => {
    const {state} = useEditor();
    const [upsertPage] = useUpdatePageMutation();

    const handleSave = async (data: any) => {
        try {
            await upsertPage({
                id: state.editor.id,
                content: JSON.stringify(state.editor.elements),
            }).unwrap();
        }catch (error) {
            console.log(error);
        }
    }
    return(
        <div className="h-[60px] flex items-center justify-center">
            <Button onClick={handleSave}>Save</Button>
        </div>
    )
};

export default EditorTopbar;