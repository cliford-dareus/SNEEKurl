import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {LuDot, LuSettings} from "react-icons/lu";
import Button from "../components/ui/button";
import EditPageModal from "../components/ui/modals/edit-page-modal";
import Portal from "../components/portal";
import {useGetPagesQuery} from "../app/services/page";

const LinkInBio = () => {
    const {data: pages, isLoading} = useGetPagesQuery();
    const [editPageActive, setEditPageActive] = useState(false);

    const handleOpenLinkInBio = async (slug: string) => {
        window.open(`http://localhost:5173/${slug}`, '_blank');
    }

    return (
        <section className="">
            {!isLoading &&
                !pages.length ?
                    <div className="flex items-center justify-center">
                        <p>You have no Link Page...</p>
                    </div>
                    :
                    <div className="flex flex-col gap-4 no-scrollbar">
                        {!isLoading && pages.map((page: any) => (
                            <>
                                <div
                                    key={page._id}
                                    className="flex gap-4 justify-between items-center bg-slate-100 hover:bg-slate-200 p-4 rounded-md"
                                >
                                    <div>
                                        <p className="font-medium text-[18px]">{page.title}</p>
                                        <p className="text-sm text-slate-700">
                                            {new Date(
                                                page.createdAt as string).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="">
                                        <p>Slug : {page.slug}</p>
                                        <p>Links : {page.links.length}</p>
                                    </div>
                                    <p>{page.isPublic ? "Public" : "Not Public"}</p>

                                    <Button
                                        onClick={() => handleOpenLinkInBio(page.slug)
                                        }
                                        className="">View Public Page
                                    </Button>

                                    <div
                                        onClick={() => setEditPageActive(true)}
                                        className="cursor-pointer"
                                    >
                                        <LuSettings/>
                                    </div>
                                </div>
                                <Portal>
                                    <EditPageModal
                                        editPageActive={editPageActive}
                                        setEditPageActive={setEditPageActive}
                                        page={page}
                                    />
                                </Portal>
                            </>
                        ))}
                    </div>
            }
        </section>

    )
};

export default LinkInBio;