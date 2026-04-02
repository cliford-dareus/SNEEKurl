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
    const {state, dispatch} = useEditor();
    const [reorderLinks, {isLoading: reorderLoading}] = useReorderPageLinksMutation();

    const manageLinksOrder = async (newOrder: any) => {
        try {
            await reorderLinks({id: state.editor.pageLinks[0].id, links: newOrder}).unwrap();
            dispatch({
                type: "LOAD_DATA",
                payload: {pageLinks: newOrder},
            })
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
                {state.editor.pageLinks && state.editor.pageLinks.map((link: any, index: number) => (
                    <LinkItem
                        key={link._id._id}
                        items={state.editor.pageLinks}
                        link={link} index={index}
                        manageLinksOrder={manageLinksOrder}
                    />
                ))}
            </div>
        </ElementWrapper>
    );
};

const LinkItem = ({items, link, index, manageLinksOrder}: any) => {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = listContainerRef.current;
        if (!el) return;

        const handleDragStart = (e: DragEvent) => {
            e.stopPropagation();
            if(e.dataTransfer){
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer?.setData("text/html", JSON.stringify(items[index]));
            }
        };

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverIndex(index);
        };

        const handleOnDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if(!e.dataTransfer?.getData("text/html")) return

            const draggedItemId = JSON.parse(e.dataTransfer?.getData("text/html"))._id._id;
            const newItems = [...items];

            const draggedItem = items.find(
                (item: any) => item._id._id === draggedItemId
            );

            newItems.splice(
                items.findIndex((item: any) => item._id._id === draggedItemId),
                1
            );
            newItems.splice(index, 0, draggedItem);

            manageLinksOrder(newItems);
            setDragOverIndex(null);
        };

        el.addEventListener('dragstart', handleDragStart, false);
        el.addEventListener('drop',handleOnDrop, false);
        el.addEventListener('dragover',handleDragOver, false);

        return () => {
            el.removeEventListener('dragover', handleDragOver, false);
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
            key={link?._id?._id}
            draggable
            ref={listContainerRef}
            onPointerDown={() => setDragOverIndex(index)}
            className="w-full flex items-center gap-4 mt-2 rounded-md border border-red-200 bg-base-200 px-4 py-1"
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
            />
            {link?.name}
            <button className="ml-auto">
                <LuSettings/>
            </button>
            <button onClick={() => handleDeleteLink(link._id._id)} className="ml-4">
                <LuTrash/>
            </button>
        </div>
    );
};

export default WebsiteList;