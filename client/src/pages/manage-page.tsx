import {useNavigate, useParams} from "react-router-dom";
import {
    useGetPageQuery,
    useReorderPageLinksMutation,
} from "../app/services/page";
import { LuSettings, LuTrash} from "react-icons/lu";
import React, {DragEvent, useEffect, useState} from "react";
import classNames from "classnames";
import {blocks} from "../components/editor/editor-components/editor-ui/blocks";
import EditorProvider, {useEditor} from "../hooks/use-editor";
import InlineEditor from "../components/editor/editor-components/editor-ui/inline-editor";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../components/ui/tabs";

type Props = {};

const ManagePage = ({}: Props) => {
    const {id} = useParams();
    const Navigate = useNavigate();
    const {data, isLoading} = useGetPageQuery({id});
    const {state, dispatch} = useEditor();
    const [activeTab, setActiveTab] = useState(state.editor.selectedElement.id !== "__body" ? "style" : "block");

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    }

    const handleStartBlockDrag = (e: DragEvent<HTMLDivElement>, type: any) => {
        if (type == null) return;
        e.dataTransfer.setData("componentType", type)
        e.dataTransfer.effectAllowed = "copy"
    }

    useEffect(() => {
        console.log(state.editor.selectedElement.id)
    }, [state.editor.selectedElement.id, activeTab, state.editor.selectedElement.type, state.editor.selectedElement.id !== "__body" ? "style" : "block"])

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
            <div className="flex gap-2 h-full">
                <div className="h-full flex-1 border border-base-200 relative">
                    <InlineEditor width={402} height={700} pageId={data?.slug}/>
                </div>

                <aside className="w-[250px] h-full">
                    <div className="">
                        <Tabs value={activeTab} onValueChange={(e) => handleTabChange(e)} className="w-full">
                            <TabsList variant="line" className="w-full">
                                <TabsTrigger className="" value="block">BLOCKS</TabsTrigger>
                                <TabsTrigger className="" value="layout">LAYOUTS</TabsTrigger>
                                <TabsTrigger className="" value="style">STYLES</TabsTrigger>
                            </TabsList>
                            <TabsContent value="block">
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {blocks.filter((block) => block.group == "block").map((block: any) => (
                                        <div
                                            className="flex flex-col gap-2 items-center justify-center w-full h-20 rounded-md bg-base-200 cursor-move"
                                            draggable
                                            key={block.id}
                                            onDragStart={(e) => handleStartBlockDrag(e, block.id)}
                                        >
                                            {block?.icon}
                                            {block.label}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="layout">
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {blocks.filter((block) => block.group == "layout").map((block: any) => (
                                        <div
                                            className="flex flex-col gap-2 items-center justify-center w-full h-20 rounded-md bg-base-200 cursor-move"
                                            draggable
                                            key={block.id}
                                            onDragStart={(e) => handleStartBlockDrag(e, block.id)}
                                        >
                                            {block?.icon}
                                            {block.label}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="style">
                                STYLES
                            </TabsContent>
                        </Tabs>
                    </div>
                </aside>
            </div>
        </EditorProvider>
    )
};

export default ManagePage;
