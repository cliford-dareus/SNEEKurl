import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPageQuery,
  useReorderPageLinksMutation,
} from "../app/services/page";
import { LuArrowLeft, LuSettings, LuTrash } from "react-icons/lu";
import {DragEvent, useEffect, useRef, useState} from "react";
import { Popover, PopoverContainer } from "../components/ui/popover";
import Button from "../components/ui/button";
import Portal from "../components/portal";
import CreateLinkBlockModal from "../components/ui/modals/create-link-block-modal";
import classNames from "classnames";
import { getSiteUrl } from "../Utils/getSiteUrl";
import { BLOCKS } from "../Utils/common";

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
      {getSiteUrl(link._id.longUrl)}

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
  const [reorderLinks, { isLoading: reorderLoading }] = useReorderPageLinksMutation();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const manageLinksOrder = async (newOrder: any) => {
    try {
      await reorderLinks({ id, links: newOrder }).unwrap();
      iframeRef.current?.contentWindow?.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    iframeRef.current?.contentWindow?.location.reload();
  }, [reorderLoading, createLinkBlockActive])

  return (
    <section className="relative">
      <div className="sticky top-0 z-20 mb-2 flex gap-4 rounded-md border border-base-200 bg-base-200 px-4 py-1">
        <div
          onClick={() => Navigate(-1)}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-base-200 py-0.5"
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
              <Popover classnames="!bg-base-300 border border-base-100">
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-center font-bold">Select a Block</p>
                </div>
                <div className="flex flex-col gap-2 items-center mt-4">
                  {BLOCKS.map((block: any) => (
                    <div
                      key={block.id}
                      onClick={() => {
                        setBlockSelected(block.tag);
                        setCreateLinkBlockActive(true);
                        setOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-base-100 hover:bg-base-300 rounded-md cursor-pointer"
                    >
                      {block.name}
                    </div>
                  ))}
                </div>
              </Popover>
            )}
          </PopoverContainer>

          {!isLoading && (
            <ul className="mt-2">
              {!isLoading &&
                data?.links.map((link: any, index: number) => (
                  <LinkItem
                    key={link._id}
                    link={link}
                    index={index}
                    items={data?.links}
                    manageLinksOrder={manageLinksOrder}
                  />
                ))}
            </ul>
          )}
        </div>
        <div className="w-[300px] h-[700px]">
          {!reorderLoading ? (
            <iframe
              ref={iframeRef}
              width="300"
              height="100%"
              src={`http://localhost:5173/${id}`}
            ></iframe>
          ) : (
              <div className="w-[300px] h-[700px] flex justify-center items-center">
                <p>Loading...</p>
              </div>
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

        {/* <EditLinkBlockModal /> */}
      </Portal>
    </section>
  );
};

export default ManageLinkInBio;
