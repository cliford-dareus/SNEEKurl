import React, {useState} from 'react';
import {Url, useDeleteUrlMutation} from "../app/services/urlapi";
import {getSiteUrl} from "../Utils/getSiteUrl";
import VisitLinkButton from "./visit-link-button";
import {
    LuBarChart,
    LuFileEdit,
    LuLink2,
    LuMoreVertical,
    LuMousePointer,
    LuQrCode,
    LuTextCursor,
    LuTrash2
} from "react-icons/lu";
import {Link} from "react-router-dom";
import EditLinkModal from "./ui/modals/edit-link-modal";
import EditQrModal from "./ui/modals/edit-qr-modal";
import ShareLinkModal from "./ui/modals/share-link-modal";
import {Popover, PopoverTrigger, PopoverContent} from "./ui/popover";
import Button from "./ui/button";
import {CgLink} from "react-icons/cg";
import {GiClick} from "react-icons/gi";

const LinkCard = ({url, plan}: { url: Url, plan: string }) => {
    const [open, setOpen] = useState(false);
    const [editActive, setEditActive] = useState(false);
    const [qrActive, setQrActive] = useState(false);
    const [shareActive, setShareActive] = useState(false);
    const [deleteUrl] = useDeleteUrlMutation();

    return (
        <>
            <div className="flex items-center rounded-md bg-base-200 p-4">
                <div className="flex items-center justify-center rounded-md bg-base-300 w-[50px] h-[50px]">
                    <img
                        className="rounded-full w-[30px] h-[30px]"
                        src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                            url.longUrl,
                        )}`}
                        loading="lazy"
                        alt="site favicon"
                    />
                </div>

                <div className="w-[50%] ml-4">
                    <div className="flex items-center gap-4">
                        <VisitLinkButton url={url}>
                            <div className="flex items-center gap-2">
                                <LuLink2 size={20} className="text-accent"/>
                                <span className="text-[18px] ">sneek.co/{url.short}</span>
                            </div>
                        </VisitLinkButton>
                        <div className="relative flex cursor-pointer items-center rounded-full p-2">
                            <span className="absolute -top-1 left-0 text-zinc-400">{url.totalClicks}</span>
                            <GiClick className="text-accent" size={16}/>
                        </div>
                    </div>

                    <p className="truncate text-sm text-zinc-400">{url.longUrl}</p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Button classnames="mrounded-lg bg-primary px-2 py-1 ml-1 hover:bg-accent transition-colors">
                        <Link to={`/analytics/${url.short}`}>
                            <LuBarChart className="text-zinc-100" size={16}/>
                        </Link>
                    </Button>

                    <Button
                        classnames="cursor-pointer bg-accent rounded-lg bg-base-200 ml-1 px-2 py-1 hover:bg-primary transition-colors"
                        onClick={() => setQrActive(true)}
                    >
                        <LuQrCode className="text-zinc-100" size={16}/>
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="cursor-pointer ml-4">
                                <LuMoreVertical size={18} className="text-zinc-400"/>
                            </div>
                        </PopoverTrigger>

                        <PopoverContent
                            side="bottom"
                            align="center"
                            className="bg-base-100 border border-base-300 flex flex-col gap-2 z-50 p-2"
                            showArrow={true}
                        >

                            <div
                                className="flex w-full cursor-pointer  bg-base-100 items-center justify-center p-2 rounded hover:bg-base-300 transition-colors"
                                onClick={() => {
                                    setEditActive(true);
                                }}
                            >
                                <LuFileEdit className="mr-2" size={16}/>
                                Edit
                            </div>

                            <div
                                className="flex w-full cursor-pointer bg-base-100 items-center justify-center p-2 rounded hover:bg-base-300 transition-colors text-error"
                                onClick={() => {
                                    deleteUrl(url.short);
                                }}
                            >
                                <LuTrash2 className="mr-2" size={16}/>
                                Delete
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

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

        </>
    );
};

export default LinkCard;
