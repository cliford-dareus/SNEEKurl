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

const LinkItem = ({items, link, index, manageLinksOrder}: any) => {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (index: number, e: DragEvent<HTMLLIElement>) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", JSON.stringify(items[index]));
    };

    const handleDragOver = (i: number, e: DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        setDragOverIndex(i);
    };

    const handleDrop = (dropIndex: number, e: DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        const draggedItemId = JSON.parse(e.dataTransfer.getData("text/html"))._id
            ._id;
        const newItems = [...items];

        const draggedItem = items.find(
            (item: any) => item._id._id === draggedItemId
        );

        newItems.splice(
            items.findIndex((item: any) => item._id._id === draggedItemId),
            1
        );
        newItems.splice(dropIndex, 0, draggedItem);

        manageLinksOrder(newItems);
        setDragOverIndex(null);
    };

    const handleDeleteLink = async (linkId: string) => {
        const newItems = items.filter((item: any, i: number) => {
            const isNotDragged = item._id._id !== linkId;
            return isNotDragged;
        });

        manageLinksOrder(newItems);
    };

    return (
        <li
            key={link?._id?._id}
            draggable
            onDragStart={(e) => handleDragStart(index, e)}
            onDragOver={(e) => handleDragOver(index, e)}
            onDrop={(e) => handleDrop(index, e)}
            className="w-full flex items-center gap-4 mt-2 rounded-md border border-base-200 bg-base-200 px-4 py-1"
        >
            <div
                className={classNames(
                    link.category === "website"
                        ? "bg-indigo-300"
                        : link.category === "social"
                            ? "bg-red-500"
                            : link.category === "marketing"
                                ? "bg-green-300"
                                : "bg-base-300",
                    "h-5 w-5 rounded-full"
                )}
            ></div>
            {link?.name}

            <button className="ml-auto">
                <LuSettings/>
            </button>
            <button onClick={() => handleDeleteLink(link._id._id)} className="ml-4">
                <LuTrash/>
            </button>
        </li>
    );
};

const ManagePage = ({}: Props) => {
    const {id} = useParams();
    const Navigate = useNavigate();
    const {data, isLoading} = useGetPageQuery({id});
    const [reorderLinks, {isLoading: reorderLoading}] = useReorderPageLinksMutation();
    const [activeTab, setActiveTab] = useState("blocks");
    const {state, dispatch} = useEditor();

    const manageLinksOrder = async (newOrder: any) => {
        try {
            await reorderLinks({id, links: newOrder}).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">

                </div>
            </div>
        );
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    }

    useEffect(() => {
        if(state.editor.selectedElement.id !== "__body"){
            setActiveTab("style");
        };

        setActiveTab("block")
    }, [state.editor.selectedElement.id, dispatch])

    const handleStartBlockDrag = (e: DragEvent<HTMLDivElement>, type: any) => {
        if (type == null) return;
        e.dataTransfer.setData("componentType", type)
        e.dataTransfer.effectAllowed = "copy"
    }

    return (
        <EditorProvider pageId={data?.slug!} pageDetails={data}>
            <div className="flex gap-2 h-full">
                <div className="h-full flex-1 border border-base-200 relative">
                    <InlineEditor width={402} height={700} pageId={data?.slug}/>
                </div>

                <aside className="w-[250px] h-full">
                    <div className="">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
