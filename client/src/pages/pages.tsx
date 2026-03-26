import React, {useState} from "react";
import {LuArrowDown, LuArrowUp, LuFilter, LuSettings, LuView} from "react-icons/lu";
import Button from "../components/ui/button";
import EditPageModal from "../components/modals/edit-page-modal";
import {useGetPagesQuery} from "../app/services/page";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {AiOutlineEdit} from "react-icons/ai";
import {GiGraspingSlug} from "react-icons/gi";
import {BsClock, BsDot} from "react-icons/bs";
import {TbClick} from "react-icons/tb";

const Pages = () => {
    const {data: pages, isLoading} = useGetPagesQuery();
    const [activeFilter, setActiveFilter] = useState<any[]>([]);
    const [editPageActive, setEditPageActive] = useState({
        state: false,
        id: "",
    });

    const handleOpenLinkInBio = async (slug: string) => {
        window.open(`http://localhost:5173/${slug}`, "_blank");
    };

    return (
        <section className="">
            <div
                className="sticky top-0 z-20 mb-4 flex items-center gap-4 rounded-md border border-base-200 bg-base-200 px-4 py-1">
                <div className="flex gap-4 items-center">
                    <div className="">
                        <span className="text-xl font-medium uppercase">My Pages</span>
                        <p className="text-xs text-base-content text-zinc-400">{pages?.length} total pages</p>
                    </div>
                    {activeFilter.length !== 0 &&
                        activeFilter?.map((filter) => (
                            <div
                                className="relative flex cursor-pointer items-center rounded-md border border-base-200 px-4 text-sm group py-0.5">
                                <div
                                    className="absolute top-0 right-0 h-3 w-3 rounded-full bg-base-100 group-hover:bg-red-500"></div>
                                {Object.keys(filter)[0]}
                                <div>
                                    {Object.values(filter)[0] == "asc" ||
                                    Object.values(filter)[0] == "most_click" ? (
                                        <LuArrowDown/>
                                    ) : (
                                        <LuArrowUp/>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
                <div className="ml-auto">
                    <div
                        className="flex cursor-pointer items-center gap-2 rounded-full bg-base-200 px-4 py-0.5"
                        // onClick={() => setOpenFilter(true)}
                    >
                        Filter
                        <LuFilter/>
                    </div>
                </div>
            </div>

            {!isLoading && !pages?.length ? (
                <div className="flex items-center justify-center">
                    <p>You have no Link Page...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 no-scrollbar">
                    {!isLoading &&
                        pages.map((page: any) => (
                            <div key={page._id}>
                                <div className="flex items-center justify-between gap-4 rounded-md bg-base-200 p-4 hover:bg-base-300">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-[18px] uppercase">{page.title}</p>
                                                <div className={classNames("text-xs py-1 px-2.5 rounded-box text-zinc-100", page.isPublic ? "bg-secondary": "bg-red-500")}>{page.isPublic ? "Public" : "Not Public"}</div>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                <span className="flex items-center gap-1"><GiGraspingSlug />{page.slug}</span>
                                                <BsDot size={12}/>
                                                <span className="flex items-center gap-1">
                                                    <BsClock size={12}/>
                                                    {new Date(page.createdAt as string).toLocaleDateString()}
                                                </span>
                                                <BsDot size={12}/>
                                                <span className="flex items-center gap-1">
                                                    <TbClick size={12}/>
                                                    {page.links.length} {page.links.length > 1 ? "Links" : "Link"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button classnames="bg-primary">
                                            <Link to={`${page.slug}`}>
                                                <AiOutlineEdit />
                                            </Link>
                                        </Button>
                                        <Button
                                            onClick={() => handleOpenLinkInBio(page.slug)}
                                            classnames="bg-accent"
                                        >
                                            <LuView className=""/>
                                        </Button>

                                        <div
                                            onClick={() =>
                                                setEditPageActive({state: true, id: page._id})
                                            }
                                            className="cursor-pointer"
                                        >
                                            <LuSettings/>
                                        </div>
                                    </div>
                                </div>

                                <>
                                    {page._id === editPageActive.id && (
                                        <EditPageModal
                                            editPageActive={editPageActive.state}
                                            setEditPageActive={setEditPageActive}
                                            page={page}
                                        />
                                    )}
                                </>
                            </div>
                        ))}
                </div>
            )}
        </section>
    );
};

export default Pages;
