import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetPageQuery } from "../app/services/page";
import { LuArrowLeft, LuSettings, LuTrash } from "react-icons/lu";
import { DragEvent, useState } from "react";
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

  const handleDragOver = (index: number, e: DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number, e: DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    const draggedItemId = JSON.parse(e.dataTransfer.getData("text/html"))._id
      ._id;

    const newItems = items.filter((item: any, i: number) => {
      const isNotDragged = item._id._id !== draggedItemId;
      const isNotPlaced = i !== index;
      return isNotDragged && isNotPlaced;
    });

    const draggedItem = items.find(
      (item: any) => item._id._id === draggedItemId
    );
    manageLinksOrder(
      [...newItems, draggedItem, ...items.slice(index)].slice(0, items.length)
    );
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
  const [state, setState] = useState(data?.links || []);
  const [open, setOpen] = useState(false);
  const [createLinkBlockActive, setCreateLinkBlockActive] = useState(false);

  const manageLinksOrder = async (newOrder: any) => {
    await fetch(`http://localhost:4080/page/manage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });
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
                    key={link}
                    link={link}
                    index={index}
                    items={data?.links}
                    manageLinksOrder={manageLinksOrder}
                  />
                ))}
            </ul>
          )}
        </div>
        <div className="w-[300px]">
          <iframe width="300" src={`http://localhost:5173/${id}`}></iframe>
        </div>
      </div>
      <Portal>
        <CreateLinkBlockModal
          createLinkBlockActive={createLinkBlockActive}
          setCreateLinkBlockActive={setCreateLinkBlockActive}
        />
      </Portal>
    </section>
  );
};

export default ManageLinkInBio;
