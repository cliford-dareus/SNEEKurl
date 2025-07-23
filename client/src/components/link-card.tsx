import React, {useState} from 'react';
import {Url, useDeleteUrlMutation} from "../app/services/urlapi";
import {useUserPlan} from "./layout/admin-layout";
import {getSiteUrl} from "../Utils/getSiteUrl";
import VisitLinkButton from "./visit-link-button";
import {LuBarChart, LuLink2, LuMoreVertical, LuQrCode, LuTrash2} from "react-icons/lu";
import {Link} from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./ui/popover";
import {toast} from "react-toastify";
import Portal from "./portal";
import EditLinkModal from "./ui/modals/edit-link-modal";
import EditQrModal from "./ui/modals/edit-qr-modal";
import ShareLinkModal from "./ui/modals/share-link-modal";

const LinkCard = ({url, plan}: { url: Url, plan: string }) => {
    const [open, setOpen] = useState(false);
    const [editActive, setEditActive] = useState(false);
    const [qrActive, setQrActive] = useState(false);
    const [shareActive, setShareActive] = useState(false);
    const [deleteUrl] = useDeleteUrlMutation();

    return (
        <>
            <div className="flex items-center gap-4 rounded-md bg-base-200 p-4">
                <img
                    className="rounded-full w-[30px] h-[30px]"
                    src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                        url.longUrl,
                    )}`}
                    loading="lazy"
                    alt="site favicon"
                />

                <div className="w-[60%]">
                    <div className="flex items-center gap-4">
                        <VisitLinkButton url={url}>
                            <div className="flex items-center gap-2 text-accent">
                                <LuLink2/>
                                sneek.co/{url.short}
                            </div>
                        </VisitLinkButton>
                    </div>

                    <p className="mt-1 truncate text-sm text-base-content">{url.longUrl}</p>
                </div>

                <div
                    className="ml-auto cursor-pointer rounded-lg bg-base-200 px-4 py-1 hover:bg-base-300 text-sm text-base-content">
                    {url.clicks} clicks
                </div>
                <div className="rounded-lg bg-base-200 px-4 py-1  hover:bg-base-300">
                    <Link to={`/analytics/${url.short}`}>
                        <LuBarChart size={20}/>
                    </Link>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <div className="cursor-pointer ml-4">
                            <LuMoreVertical size={24} />
                        </div>
                    </PopoverTrigger>
                    
                    <PopoverContent
                        side="bottom"
                        align="end"
                        className="bg-base-200 border border-base-300 flex flex-col gap-2 z-50 p-2"
                        showArrow={true}
                    >
                        <div
                            className="flex w-full cursor-pointer items-center justify-center p-2 rounded hover:bg-base-300 transition-colors"
                            onClick={() => {
                                setQrActive(true);
                            }}
                        >
                            <LuQrCode className="mr-2" size={16} />
                            QR Code
                        </div>

                        <div
                            className="flex w-full cursor-pointer items-center justify-center p-2 rounded hover:bg-base-300 transition-colors"
                            onClick={() => {
                                setEditActive(true);
                            }}
                        >
                            {/* <LuEdit className="mr-2" size={16} /> */}
                            Edit
                        </div>

                        <div
                            className="flex w-full cursor-pointer items-center justify-center p-2 rounded hover:bg-base-300 transition-colors text-error"
                            onClick={() => {
                                // setDeleteActive(true);
                            }}
                        >
                            <LuTrash2 className="mr-2" size={16} />
                            Delete
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Portal>
                <EditLinkModal
                    url={url}
                    editActive={editActive}
                    setEditActive={setEditActive}
                    plan={plan}
                />

                <EditQrModal
                    url={url}
                    setQrActive={setQrActive}
                    editQrActive={qrActive}
                />

                <ShareLinkModal
                    shareActive={shareActive}
                    setShareActive={setShareActive}
                    url={url}
                />
            </Portal>
        </>
    );
};

export default LinkCard;
