import React, {useState} from 'react';
import {Url, useDeleteUrlMutation} from "../app/services/urlapi";
import {useUserPlan} from "./layout/admin-layout";
import {getSiteUrl} from "../Utils/getSiteUrl";
import VisitLinkButton from "./visit-link-button";
import {LuBarChart, LuLink2, LuMoreVertical} from "react-icons/lu";
import {Link} from "react-router-dom";
import {Popover, PopoverContainer} from "./ui/popover";
import {toast} from "react-toastify";
import Portal from "./portal";
import EditLinkModal from "./ui/modals/edit-link-modal";
import EditQrModal from "./ui/modals/edit-qr-modal";
import ShareLinkModal from "./ui/modals/share-link-modal";

const LinkCard = ({url}: { url: Url }) => {
    const plan = useUserPlan();
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

                <PopoverContainer classnames="ml-4" triggerFn={setOpen}>
                    <div className="cursor-pointer" onClick={() => setOpen(!open)}>
                        <LuMoreVertical size={24}/>
                    </div>

                    {open && (
                        <Popover classnames="bg-base-200 border border-base-300 flex flex-col gap-2 z-50">
                            <div
                                className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-base-300"
                                onClick={() => {
                                    setQrActive(true);
                                    setOpen(false);
                                }}
                            >
                                Qr
                            </div>

                            <div
                                className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-base-300"
                                onClick={() => {
                                    setEditActive(true);
                                    setOpen(false);
                                }}
                            >
                                Edit
                            </div>

                            <div
                                className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-base-300"
                                onClick={() => {
                                    setShareActive(true);
                                    setOpen(false);
                                }}
                            >
                                Share
                            </div>
                            <div
                                className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-base-300"
                                onClick={async () => {
                                    try {
                                        await deleteUrl(url.short).unwrap();
                                        toast.success("Short Deleted")
                                    } catch (err) {
                                        console.log(err);
                                        toast.error("Something went wrong")
                                    }
                                }}
                            >
                                Delete
                            </div>
                        </Popover>
                    )}
                </PopoverContainer>
            </div>

            <Portal>
                <EditLinkModal
                    url={url}
                    editActive={editActive}
                    setEditActive={setEditActive}
                    plan={plan.plan!}
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
