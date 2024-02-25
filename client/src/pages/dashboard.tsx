import {useCallback, useEffect, useMemo, useState} from "react";
import {useAppSelector} from "../app/hook";
import {RootState} from "../app/store";
import {Url, useGetUrlsQuery} from "../app/services/urlapi";
import {Link, useSearchParams} from "react-router-dom";
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

const LinkCard = ({url}: { url: Url }) => {
    const [open, setOpen] = useState(false);
    const [editActive, setEditActive] = useState(false);
    const [qrActive, setQrActive] = useState(false);
    const [shareActive, setShareActive] = useState(false);

    return (
        <>
            <div className="bg-slate-100 rounded-MD p-4 flex gap-4 items-center">
                <img
                    className="w-[30px] h-[30px] rounded-full"
                    src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                        url.longUrl
                    )}`}
                    loading="lazy"
                    alt="site favicon"
                />

                <div className="w-[60%]">
                    <div className="flex items-center gap-4">
                        <VisitLinkButton url={url}>
                            <div className="text-blue-700 flex gap-2 items-center">
                                <LuLink2/>
                                sneek.co/{url.short}
                            </div>
                        </VisitLinkButton>
                    </div>

                    <p className="truncate mt-1">{url.longUrl}</p>
                </div>

                <div
                    className="py-1 px-4 bg-slate-100 rounded-lg ml-auto hover:border hover:border-slate-300 cursor-pointer">
                    {url.clicks} clicks
                </div>

                <PopoverContainer classnames="ml-4" triggerFn={setOpen}>
                    <div className="cursor-pointer" onClick={() => setOpen(!open)}>
                        <LuMoreVertical size={24}/>
                    </div>

                    {open && (
                        <Popover classnames="right-0 top-6 flex flex-col gap-2 z-50">
                            <div
                                className="p-2 shadow-md"
                                onClick={() => {
                                    setQrActive(true);
                                    setOpen(false);
                                }}
                            >
                                Qr
                            </div>

                            <div
                                className="p-2 shadow-md"
                                onClick={() => {
                                    setEditActive(true);
                                    setOpen(false);
                                }}
                            >
                                Edit
                            </div>

                            <div
                                className="p-2 shadow-md"
                                onClick={() => {
                                    setShareActive(true);
                                    setOpen(false);
                                }}
                            >
                                Share
                            </div>
                            <div className="p-2 shadow-md">Delete</div>
                        </Popover>
                    )}
                </PopoverContainer>
            </div>

            <Portal>
                <EditLinkModal
                    url={url}
                    editActive={editActive}
                    setEditActive={setEditActive}
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
        <div className="flex flex-col gap-4 no-scrollbar">
            {!isLoading &&
                data?.urls.map((url) => <LinkCard key={url._id} url={url}/>)}
        </div>
    );
};

const Dashboard = () => {
    const [openFilter, setOpenFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState<any[]>([]);
    const user = useAppSelector((state: RootState) => state.auth);


    console.log(activeFilter)

    return (
        <>
            <section className="">
                <div className="flex gap-4 mb-2 py-1 px-4 border border-slate-200 rounded-md">
                    <div className="flex gap-4">
                        {activeFilter.length && activeFilter?.map(filter => (
                            <div
                                className="flex items-center relative rounded-md py-0.5 border border-slate-200 text-sm px-4"
                            >
                                {Object.keys(filter)[0]}
                                <div>{Object.values(filter)[0] == 'asc' || Object.values(filter)[0] == 'most_click' ? <LuArrowDown />: <LuArrowUp />}</div>
                            </div>
                        ))}
                    </div>
                    <div className="ml-auto">
                        <div
                            className="px-4 py-0.5 bg-slate-200 flex items-center gap-2 rounded-full cursor-pointer"
                            onClick={() => setOpenFilter(true)}
                        >
                            Filter
                            <LuFilter/>
                        </div>
                    </div>
                </div>

                <LinkItems/>

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
