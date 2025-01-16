import {useEffect, useMemo, useRef, useState} from "react";
import {
    Url,
    useDeleteUrlMutation, useGetUrlClicksQuery, useGetUrlQuery,
    useGetUrlsQuery,
} from "../app/services/urlapi";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {
    LuArrowDown,
    LuArrowUp,
    LuBarChart,
    LuFilter,
    LuLink2,
    LuMoreVertical,
} from "react-icons/lu";
import {getSiteUrl} from "../Utils/getSiteUrl";
import {Popover, PopoverContainer} from "../components/ui/popover";
import EditLinkModal from "../components/ui/modals/edit-link-modal";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import ShareLinkModal from "../components/ui/modals/share-link-modal";
import Portal from "../components/portal";
import VisitLinkButton from "../components/visit-link-button";
import FilterLinkModal from "../components/ui/modals/filter-link-modal";
import {useUserPlan} from "../components/layout/admin-layout";
import {toast} from "react-toastify";
import LinkItems from "../components/link-items";
import MyResponsiveLine from "../components/ui/responsive-line";
import {CHART_DATA} from "../Utils/common";
import {useAppSelector} from "../app/hook";
import {selectCurrentUser} from "../features/auth/authslice";
import useQuery from "../hooks/use-query";
import {clickByMonth} from "../Utils/agregate-by-month";

const Dashboard = () => {
    let query = useQuery();
    const [openFilter, setOpenFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState<any[]>([]);
    const user = useAppSelector(selectCurrentUser)
    const {data, isLoading} = useGetUrlsQuery({search: query.get('search')}, {refetchOnMountOrArgChange: true});
    const {data: d, isLoading: loading} = useGetUrlClicksQuery({})

    const totalClicks = useMemo(() => {
        let sum = 0;
        data?.urls.forEach(e => {
            if (e.clicks) {
                sum += e.clicks
            }
        });
        return sum;
    }, [data]);

    const chartData = useMemo(() => {
            const clickByMonths = clickByMonth(d);
            if (!d || clickByMonths == undefined) return [];
            return [
                {
                    "id": "Clicks",
                    "color": "hsl(331, 70%, 50%)",
                    "data": clickByMonths
                }
            ]
        },
        [d, loading]
    );

    return (
        <>
            <section className="relative">
                <div className="mb-4 flex justify-between items-center">
                    <div className="">
                        <h2 className="font-medium text-xl">Hey, {user.user.username}</h2>
                        <p className="text-slate-500 text-sm">Track your links and customize your bio links</p>
                    </div>
                    <div className="">

                    </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 h-[200px]">
                    <div className="flex-1 flex relative border rounded-md p-4">
                        <div className="absolute top-4 left-4">
                            <span>{totalClicks}</span>
                            <p className="text-sm leading-3 text-slate-500">Total clicks</p>
                        </div>
                        <div className="h-[130px] w-full mt-auto">
                            <MyResponsiveLine data={chartData}/>
                        </div>
                    </div>
                    <div className="flex-1 flex relative border rounded-md p-4">
                        <div className="absolute top-4 left-4">
                            <span>{totalClicks}</span>
                            <p className="text-sm leading-3 text-slate-500">Visitors</p>
                        </div>
                        <div className="h-[130px] w-full mt-auto">
                            <MyResponsiveLine data={chartData}/>
                        </div>
                    </div>
                    <div className="flex-1 flex relative border rounded-md p-4">
                        <div className="absolute top-4 left-4">
                            <span>{totalClicks}</span>
                            <p className="text-sm leading-3 text-slate-500">Un-used</p>
                        </div>
                        <div className="h-[130px] w-full mt-auto">
                            <MyResponsiveLine data={chartData}/>
                        </div>
                    </div>
                </div>

                <div
                    className="sticky top-0 z-20 my-4 flex items-center gap-4 rounded-md border border-slate-200 bg-white px-4 py-1">
                    <div className="flex items-center gap-4">
                        <div className="">
                            <span>My Links</span>
                            <p className="text-sm text-slate-500">{data?.urls.length} total links</p>
                        </div>
                        {activeFilter.length !== 0 &&
                            activeFilter?.map((filter) => (
                                <div
                                    className="relative flex cursor-pointer items-center rounded-md border border-slate-200 px-4 text-sm group py-0.5">
                                    <div
                                        className="absolute top-0 right-0 h-3 w-3 rounded-full bg-white group-hover:bg-red-500"></div>
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
                            className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-200 px-4 py-0.5"
                            onClick={() => setOpenFilter(true)}
                        >
                            <p className="text-sm text-slate-500">Filter</p>
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
