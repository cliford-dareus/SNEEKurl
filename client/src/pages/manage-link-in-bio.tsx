import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetPageQuery,
  useReorderPageLinksMutation,
} from "../app/services/page";
import { LuArrowLeft, LuSettings, LuTrash } from "react-icons/lu";
import { DragEvent, useRef, useState } from "react";
import { Popover, PopoverContainer } from "../components/ui/popover";
import Button from "../components/ui/button";
import Portal from "../components/portal";
import CreateLinkBlockModal from "../components/ui/modals/create-link-block-modal";
import classNames from "classnames";

type Props = {};

const LinkItem = ({ items, link, index, manageLinksOrder }: any) => {
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
      key={link._id._id}
      draggable
      onDragStart={(e) => handleDragStart(index, e)}
      onDragOver={(e) => handleDragOver(index, e)}
      onDrop={(e) => handleDrop(index, e)}
      className="w-full flex items-center gap-4 mt-2 rounded-md border border-slate-200 bg-slate-100 px-4 py-1"
    >
      <div
        className={classNames(
          link.category === "website" ? "bg-indigo-300" : "bg-slate-200",
          "h-5 w-5 rounded-full"
        )}
      ></div>
      {link._id.short}

      <button className="ml-auto">
        <LuSettings />
      </button>
      <button onClick={() => handleDeleteLink(link._id._id)} className="ml-4">
        <LuTrash />
      </button>
    </li>
  );
};

const ManageLinkInBio = ({}: Props) => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetPageQuery({ id });
  const [open, setOpen] = useState(false);
  const [blockSelected, setBlockSelected] = useState("");
  const [createLinkBlockActive, setCreateLinkBlockActive] = useState(false);
  const [reorderLinks] = useReorderPageLinksMutation();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const manageLinksOrder = async (newOrder: any) => {
    try {
      await reorderLinks({ id, links: newOrder }).unwrap();
      iframeRef.current?.contentWindow?.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="relative">
      <div className="sticky top-0 z-20 mb-2 flex gap-4 rounded-md border border-slate-200 bg-slate-100 px-4 py-1">
        <div
          onClick={() => Navigate(-1)}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 py-0.5"
        >
          <LuArrowLeft />
          Back
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <PopoverContainer triggerFn={setOpen} classnames="">
            <Button onClick={() => setOpen(!open)}>Add Block</Button>
            {open && (
              <Popover>
                <div
                  onClick={() => {
                    setBlockSelected("social");
                    setCreateLinkBlockActive(true);
                    setOpen(false);
                  }}
                  className=""
                >
                  Social Block
                </div>
                <div className="">Marketing Block</div>
              </Popover>
            )}
          </PopoverContainer>

          {!isLoading && (
            <ul className="mt-2">
              {!isLoading &&
                data?.links.map((link: any, index: number) => (
                  <LinkItem
                    key={link._id._id}
                    link={link}
                    index={index}
                    items={data?.links}
                    manageLinksOrder={manageLinksOrder}
                  />
                ))}
            </ul>
          )}
        </div>
        <div className="w-[300px] h-[700px] border">
          {!isLoading ? (
            <iframe
              ref={iframeRef}
              width="300"
              height="100%"
              src={`http://localhost:5173/${id}`}
            ></iframe>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      </div>
      <Portal>
        <CreateLinkBlockModal
          blockSelected={blockSelected}
          setBlockSelected={setBlockSelected}
          createLinkBlockActive={createLinkBlockActive}
          setCreateLinkBlockActive={setCreateLinkBlockActive}
          pageId={data?._id}
        />
      </Portal>
    </section>
  );
};

export default ManageLinkInBio;
