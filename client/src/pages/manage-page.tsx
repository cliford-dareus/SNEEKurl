import {useNavigate, useParams} from "react-router-dom";
import {
    useGetPageQuery,
    useReorderPageLinksMutation,
} from "../app/services/page";
import {LuArrowLeft, LuSettings, LuTrash} from "react-icons/lu";
import React, {DragEvent, useEffect, useRef, useState} from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "../components/ui/popover";
import Button from "../components/ui/button";
import CreateLinkBlockModal from "../components/modals/create-link-block-modal";
import classNames from "classnames";
import {getSiteUrl} from "../Utils/getSiteUrl";
import {BLOCKS} from "../Utils/common";
import CustomizeLinksInBioModal from "../components/modals/customize-links-in-bio-modal";
import LinksInBioPreview from "../components/links-in-bio-preview";
import PageEditor from "../components/editor";
import {blocks} from "../components/editor/editor-components/blocks";
import EditorProvider from "../hooks/use-editor";

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
    const Navigate = useNavigate();
    const {id} = useParams();
    const {data, isLoading} = useGetPageQuery({id});
    const [blockSelected, setBlockSelected] = useState("");
    const [createLinkBlockActive, setCreateLinkBlockActive] = useState(false);
    const [customizePageOpen, setCustomizePageOpen] = useState(false);
    const [reorderLinks, {isLoading: reorderLoading}] = useReorderPageLinksMutation();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const manageLinksOrder = async (newOrder: any) => {
        try {
            await reorderLinks({id, links: newOrder}).unwrap();
            iframeRef.current?.contentWindow?.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        iframeRef.current?.contentWindow?.location.reload();
    }, [reorderLoading, createLinkBlockActive, customizePageOpen]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">

                </div>
            </div>
        );
    }

    const handleStartBlockDrag = (e: DragEvent<HTMLDivElement>, type: any) => {
        if (type == null) return;
        e.dataTransfer.setData("componentType", type)
    }

    return (
        <EditorProvider pageId={data?.slug!} pageDetails={data}>
            <div className="flex gap-2 h-full">
                <div className="h-full border">
                    <PageEditor pageId={data?.slug!} liveMode={false}/>
                </div>
                <aside className="w-[200px] h-full">
                    {blocks.map((block: any) => (
                        <div
                            className="flex items-center justify-center w-full h-12 border border-base-200 bg-base-200 cursor-move"
                            draggable
                            key={block.id}
                            onDragStart={(e) => handleStartBlockDrag(e, block.id)}
                        >
                            {block.label}
                        </div>
                    ))}
                </aside>
            </div>
        </EditorProvider>
    )

    // return (
    //     <section className="relative">
    //         <div className="sticky top-0 z-20 mb-2 flex gap-4 rounded-md border border-base-200 bg-base-200 px-4 py-1">
    //             <div
    //                 onClick={() => Navigate(-1)}
    //                 className="flex cursor-pointer items-center gap-2 rounded-full bg-base-200 py-0.5"
    //             >
    //                 <LuArrowLeft/>
    //                 Back
    //             </div>
    //         </div>
    //
    //         <div className="flex gap-4">
    //             <div className="flex-1">
    //                 <div className="flex items-center justify-between">
    //                     <h1 className="text-2xl font-bold">Manage Links</h1>
    //                     <div className="flex items-center gap-2">
    //                         <Button onClick={() => setCustomizePageOpen(true)} classnames="border text-accent-content">Customize</Button>
    //                         <Popover>
    //                             <PopoverTrigger>
    //                                 <Button
    //                                     classnames="bg-primary flex items-center py-1.5 px-3 rounded-md justify-center text-white">Add
    //                                     Block</Button>
    //                             </PopoverTrigger>
    //                             <PopoverContent
    //                                 side="bottom"
    //                                 align="start"
    //                                 className="!bg-base-300 border border-base-100 p-4"
    //                                 showArrow={true}
    //                             >
    //                                 <div className="flex flex-col gap-2 items-center">
    //                                     <p className="text-center font-bold">Select a Block</p>
    //                                 </div>
    //                                 <div className="flex flex-col gap-2 items-center mt-4">
    //                                     {BLOCKS.map((block: any) => (
    //                                         <div
    //                                             key={block.id}
    //                                             onClick={() => {
    //                                                 setBlockSelected(block.tag);
    //                                                 setCreateLinkBlockActive(true);
    //                                             }}
    //                                             className="w-full px-4 py-2 bg-base-100 hover:bg-base-300 rounded-md cursor-pointer transition-colors"
    //                                         >
    //                                             {block.name}
    //                                         </div>
    //                                     ))}
    //                                 </div>
    //                             </PopoverContent>
    //                         </Popover>
    //                     </div>
    //                 </div>
    //
    //                 {!isLoading && (
    //                     <ul className="mt-2">
    //                         {!isLoading &&
    //                             data?.links.map((link: any, index: number) => (
    //                                 <LinkItem
    //                                     key={index}
    //                                     link={link}
    //                                     index={index}
    //                                     items={data?.links}
    //                                     manageLinksOrder={manageLinksOrder}
    //                                 />
    //                             ))}
    //                     </ul>
    //                 )}
    //             </div>
    //             <div className="w-[350px] h-[700px]">
    //                 {!reorderLoading ? (
    //                     <iframe
    //                         ref={iframeRef}
    //                         width="350"
    //                         height="100%"
    //                         src={`http://localhost:5173/${id}`}
    //                     >
    //                         <LinksInBioPreview data={data!} isLoading={isLoading} classnames="w-full h-full p-4" container=""/>
    //                     </iframe>
    //                 ) : (
    //                     <div
    //                         className="animate-pulse rounded-md bg-muted w-[300px] h-[700px] flex justify-center items-center"/>
    //                 )}
    //             </div>
    //         </div>
    //
    //         <CreateLinkBlockModal
    //             blockSelected={blockSelected}
    //             setBlockSelected={setBlockSelected}
    //             createLinkBlockActive={createLinkBlockActive}
    //             setCreateLinkBlockActive={setCreateLinkBlockActive}
    //             pageId={data?._id as string}
    //         />
    //
    //         <CustomizeLinksInBioModal
    //             customizePageOpen={customizePageOpen}
    //             setCustomizePageOpen={setCustomizePageOpen}
    //             data={data!}
    //         />
    //     </section>
    // );
};

export default ManagePage;
