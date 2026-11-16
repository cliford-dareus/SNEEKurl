import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import ElementWrapper from "../layouts/element-wrapper";
import { LuSettings, LuTrash } from "react-icons/lu";
import { EditorElement, useEditor } from "../../../../../../hooks/use-editor";
import { useReorderPageLinksMutation } from "../../../../../../app/services/page";

type WebsiteListProps = {
  element: EditorElement;
};

const WebsiteList = ({ element }: WebsiteListProps) => {
  const { state, pageDetails, dispatch } = useEditor();
  const [reorderLinks] = useReorderPageLinksMutation();

  const manageLinksOrder = async (newOrder: any) => {
    try {
      const data = await reorderLinks({
        id: pageDetails.slug,
        links: newOrder,
      }).unwrap();
      const newLinks = data?.links;

      dispatch({
        type: "UPDATE_PAGE_LINKS",
        payload: {
          pageLinks: newLinks,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ElementWrapper element={element}>
      <div
        style={element.styles}
        className="relative flex w-full flex-col transition-all"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Links
          </h3>
        </div>
        <LinkContainer
          items={state.editor.pageLinks || []}
          manageLinksOrder={manageLinksOrder}
          liveMode={state.editor.liveMode}
        />
      </div>
    </ElementWrapper>
  );
};

const LinkContainer = ({
  items,
  manageLinksOrder,
  liveMode,
}: {
  items: any[];
  manageLinksOrder: (items: any[]) => void;
  liveMode: boolean;
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, i: number) => {
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", JSON.stringify(items[i]));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(i);
  };

  useEffect(() => {
    const el = listContainerRef.current;
    if (!el) return;

    const handleOnDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const raw = e.dataTransfer?.getData("text/html");
      if (!raw) return;

      try {
        const dragged = JSON.parse(raw);
        const draggedItemId = dragged._id?._id || dragged._id;
        const newItems = [...items];

        const draggedItem = items.find(
          (item: any) => (item._id?._id || item._id) === draggedItemId
        );

        if (!draggedItem || dragOverIndex === null) return;

        const fromIndex = items.findIndex(
          (item: any) => (item._id?._id || item._id) === draggedItemId
        );
        newItems.splice(fromIndex, 1);
        newItems.splice(dragOverIndex, 0, draggedItem);

        manageLinksOrder(newItems);
      } catch {
        // ignore
      }
      setDragOverIndex(null);
    };

    el.addEventListener("drop", handleOnDrop, false);
    return () => {
      el.removeEventListener("drop", handleOnDrop, false);
    };
  }, [items, dragOverIndex, manageLinksOrder]);

  const handleDeleteLink = (linkId: string) => {
    const newItems = items.filter((item: any) => {
      const id = item._id?._id || item._id;
      return id !== linkId;
    });
    manageLinksOrder(newItems);
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-3">
        <div className="size-5 rounded-full bg-muted" />
        <p className="text-sm text-muted-foreground">No links yet</p>
      </div>
    );
  }

  return (
    <div ref={listContainerRef} className="flex w-full flex-col gap-1.5">
      {items.map((item: any, index: number) => {
        const id = item._id?._id || item._id || index;
        return (
          <div
            key={id}
            draggable={!liveMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            className={classNames(
              "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors",
              dragOverIndex === index && "border-primary/50 bg-primary/5",
              !liveMode && "cursor-grab active:cursor-grabbing"
            )}
          >
            <div
              className={classNames(
                "size-2.5 shrink-0 rounded-full",
                item.category === "website"
                  ? "bg-primary"
                  : item.category === "social"
                    ? "bg-rose-400"
                    : item.category === "marketing"
                      ? "bg-emerald-400"
                      : "bg-muted-foreground/40"
              )}
            />
            <span className="min-w-0 flex-1 truncate text-foreground">
              {item?.name || "Untitled"}
            </span>
            {!liveMode && (
              <>
                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Settings"
                >
                  <LuSettings size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLink(id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Delete"
                >
                  <LuTrash size={14} />
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WebsiteList;
