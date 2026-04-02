import classNames from "classnames";
import {useEffect, useRef, useState} from "react";
import ElementWrapper from "../element-wrapper";
import {LuSettings, LuTrash} from "react-icons/lu";
import {EditorElement, useEditor} from "../../../../../hooks/use-editor";
import {useReorderPageLinksMutation} from "../../../../../app/services/page";

type TextProps = {
    element: EditorElement;
};

function WebsiteList({element}: TextProps) {
    const {state, pageDetails, dispatch} = useEditor();
    const [reorderLinks, {isLoading: reorderLoading}] = useReorderPageLinksMutation();

    const manageLinksOrder = async (newOrder: any) => {
        try {
            const data = await reorderLinks({id: pageDetails.slug, links: newOrder}).unwrap();
            const newLinks = data?.links
            // dispatch to update the links in the state
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ElementWrapper element={element}>
            <div
                style={element.styles}
                className="flex flex-col w-full relative transition-all overflow-auto"
            >
                <LinkContainer
                    pageId={pageDetails._id}
                    items={state.editor.pageLinks}
                    manageLinksOrder={manageLinksOrder}
                />

            </div>
        </ElementWrapper>
    );
};

const LinkContainer = ({ items, manageLinksOrder}: any) => {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, i: number) => {
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer?.setData("text/html", JSON.stringify(items[i]));
        }
        setDraggedItem(i)
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, i: number) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("drag over", i);
        setDragOverIndex(i);
    };

    useEffect(() => {
        const el = listContainerRef.current;
        if (!el) return;

        const handleOnDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (!e.dataTransfer?.getData("text/html")) return

            const draggedItemId = JSON.parse(e.dataTransfer?.getData("text/html"))._id._id;
            const newItems = [...items];

            const draggedItem = items.find(
                (item: any) => item._id._id === draggedItemId
            );

            newItems.splice(items.findIndex((item: any) => item._id._id === draggedItemId), 1);
            newItems.splice(dragOverIndex!, 0, draggedItem);

            manageLinksOrder(newItems);
            setDragOverIndex(null);
        };

        el.addEventListener('drop', handleOnDrop, false);

        return () => {
            el.removeEventListener('drop', handleOnDrop, false);
        };
    }, []);

    const handleDeleteLink = async (linkId: string) => {
        const newItems = items.filter((item: any, i: number) => {
            return item._id._id !== linkId;
        });
        manageLinksOrder(newItems);
    };

    return (
        <div
            className="w-full"
        >
            {items.map((item: any, index: number) => (
                <div
                    key={item?._id?._id}
                    draggable
                    ref={listContainerRef}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    className="w-full flex items-center gap-4 rounded-md border border-red-200 bg-base-200 px-4 py-1"
                >
                    <div
                        className={classNames(
                            item.category === "website"
                                ? "bg-indigo-300"
                                : item.category === "social"
                                    ? "bg-red-500"
                                    : item.category === "marketing"
                                        ? "bg-green-300"
                                        : "bg-base-300",
                            "h-5 w-5 rounded-full"
                        )}
                    />
                    {item?.name}
                    <button className="ml-auto">
                        <LuSettings/>
                    </button>
                    <button onClick={() => handleDeleteLink(item._id._id)} className="ml-4">
                        <LuTrash/>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default WebsiteList;