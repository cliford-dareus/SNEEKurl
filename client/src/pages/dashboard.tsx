import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppSelector} from "../app/hook";
import {RootState} from "../app/store";
import {Url, useGetUrlsQuery} from "../app/services/urlapi";
import {Link, useOutletContext, useSearchParams} from "react-router-dom";
import {LuArrowDown, LuArrowUp, LuFilter, LuLink2, LuMoreVertical} from "react-icons/lu";
import {getSiteUrl} from "../Utils/getSiteUrl";
import {Popover, PopoverContainer} from "../components/ui/popover";
import EditLinkModal from "../components/ui/modals/edit-link-modal";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import ShareLinkModal from "../components/ui/modals/share-link-modal";
import Portal from "../components/portal";
import VisitLinkButton from "../components/visit-link-button";
import {Select} from "../components/ui/select";
import FilterLinkModal from "../components/ui/modals/filter-link-modal";
import Button from "../components/ui/button";
import {useUserPlan} from "../components/admin-layout";
import useScroll from "../Utils/hooks/use-scroll";

const LinkCard = ({url}: { url: Url }) => {
    const plan = useUserPlan();
    const [open, setOpen] = useState(false);
    const [editActive, setEditActive] = useState(false);
    const [qrActive, setQrActive] = useState(false);
    const [shareActive, setShareActive] = useState(false);

    return (
        <>
            <div className="flex items-center gap-4 rounded-md bg-slate-100 p-4">
                <img
                    className="rounded-full w-[30px] h-[30px]"
                    src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                        url.longUrl
                    )}`}
                    loading="lazy"
                    alt="site favicon"
                />

                <div className="w-[60%]">
                    <div className="flex items-center gap-4">
                        <VisitLinkButton url={url}>
                            <div className="flex items-center gap-2 text-blue-700">
                                <LuLink2/>
                                sneek.co/{url.short}
                            </div>
                        </VisitLinkButton>
                    </div>

                    <p className="mt-1 truncate">{url.longUrl}</p>
                </div>

                <div
                    className="ml-auto cursor-pointer rounded-lg bg-slate-100 px-4 py-1 hover:border hover:border-slate-300">
                    {url.clicks} clicks
                </div>

                <PopoverContainer classnames="ml-4" triggerFn={setOpen}>
                    <div className="cursor-pointer" onClick={() => setOpen(!open)}>
                        <LuMoreVertical size={24}/>
                    </div>

                    {open && (
                        <Popover classnames="bg-slate-200 border border-slate-300 flex flex-col gap-2 z-50">
                            <div
                                className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-slate-300"
                                onClick={() => {
                                    setQrActive(true);
                                    setOpen(false);
                                }}
                            >
                                Qr
                            </div>

                            <div
                                className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-slate-300"
                                onClick={() => {
                                    setEditActive(true);
                                    setOpen(false);
                                }}
                            >
                                Edit
                            </div>

                            <div
                                className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-slate-300"
                                onClick={() => {
                                    setShareActive(true);
                                    setOpen(false);
                                }}
                            >
                                Share
                            </div>
                            <div className="flex w-full cursor-pointer items-center justify-center p-2 shadow-md hover:bg-slate-300">Delete</div>
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

const LinkItems = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [queryParams, setQueryParams] = useState<string | null>("");

    const sort = searchParams.get("sort");
    const page = searchParams.get("page");
    const clicks = searchParams.get("clicks");

    const skip = useMemo(() =>
            queryParams?.split('').every(x => x !== ''),
        [queryParams]
    )

    const {data, isLoading} = useGetUrlsQuery(queryParams, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: skip
    });

    useEffect(() => {
        const createQueryParams = (s: { [key: string]: string | null }) => {
            let str = [];
            for (const [key, value] of Object.entries(s)) {
                if (value === null) {
                    continue;
                } else {
                    str.push(`${key}=${value}`);
                }
            }
            setQueryParams(str.join("&"));
        };

        createQueryParams({page, sort, clicks});
    }, [searchParams, page, sort, clicks]);

    return (
        <div className="flex flex-col gap-4 no-scrollbar" >
            {!isLoading &&
                data?.urls.map((url) => <LinkCard key={url._id} url={url}/>)}
        </div>
    );
};

const Dashboard = () => {
    const [openFilter, setOpenFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState<any[]>([]);
    // const user = useAppSelector((state: RootState) => state.auth);
    // const plan = useUserPlan();

    return (
        <>
            <section className="relative">
                <div className="sticky top-0 z-20 mb-2 flex gap-4 rounded-md border border-slate-200 bg-slate-100 px-4 py-1">
                    <div className="flex gap-4">
                        {activeFilter.length !== 0 && activeFilter?.map(filter => (
                            <div
                                className="relative flex cursor-pointer items-center rounded-md border border-slate-200 px-4 text-sm group py-0.5"
                            >
                                <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-white group-hover:bg-red-500"></div>
                                {Object.keys(filter)[0]}
                                <div >
                                    {Object.values(filter)[0] == 'asc' || Object.values(filter)[0] == 'most_click' ?
                                        <LuArrowDown/> : <LuArrowUp/>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="ml-auto">
                        <div
                            className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-200 px-4 py-0.5"
                            onClick={() => setOpenFilter(true)}
                        >
                            Filter
                            <LuFilter/>
                        </div>
                    </div>
                </div>

                <LinkItems />

                <Portal>
                    <FilterLinkModal
                        open={openFilter}
                        setOpen={setOpenFilter}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />
                </Portal>
            </section>
        </>
    );
};

export default Dashboard;
