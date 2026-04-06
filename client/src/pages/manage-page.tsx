import {useParams} from "react-router-dom";
import {
    useGetPageQuery
} from "../app/services/page";
import React from "react";
import EditorProvider from "../hooks/use-editor";
import InlineEditor from "../components/editor/editor-components/editor-ui/inline-editor";
import EditorSidebar from "../components/editor/editor-components/editor-ui/editor-sidebar/editor-sidebar";
import {Button} from "../components/ui/button";

type Props = {};

const ManagePage = ({}: Props) => {
    const {id} = useParams();
    const {data, isLoading} = useGetPageQuery({id});

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">

                </div>
            </div>
        );
    }

    return (
        <EditorProvider pageId={data?.slug!} pageDetails={data}>
            <div className="flex gap-4 h-full">
                <div className="h-full flex-1 border rounded-md relative">
                    <div className="h-[60px] flex items-center justify-center">
                        <Button>Save</Button>
                    </div>
                    <InlineEditor width={402} height={700} pageId={data?.slug}/>
                </div>
                <EditorSidebar />
            </div>
        </EditorProvider>
    )
};

export default ManagePage;
