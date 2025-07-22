import {useEffect, useMemo, useRef, useState} from "react";
import {
    Url,
    useDeleteUrlMutation, useGetUrlClicksQuery, useGetUrlQuery,
    useGetUrlsQuery, useGetUserAnalyticsQuery,
} from "../app/services/urlapi";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {
    LuArrowDown,
    LuArrowUp,
    LuBarChart,
    LuFilter,
    LuLink2,
    LuMoreVertical,
    LuTrendingUp,
    LuUsers,
    LuMousePointer,
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
    const [analyticsPeriod, setAnalyticsPeriod] = useState('30d');
    const user = useAppSelector(selectCurrentUser)
    const {data, isLoading} = useGetUrlsQuery({search: query.get('search')}, {refetchOnMountOrArgChange: true});
    const {data: userAnalytics, isLoading: analyticsLoading} = useGetUserAnalyticsQuery(analyticsPeriod);

    const totalClicks = useMemo(() => {
        return userAnalytics?.analytics?.overview?.totalClicks || 0;
    }, [userAnalytics]);

    const chartData = useMemo(() => {
        if (!userAnalytics?.analytics?.clicksOverTime) return [];

        return [
            {
                "id": "Clicks",
                "color": "hsl(331, 70%, 50%)",
                "data": userAnalytics.analytics.clicksOverTime.map(item => ({
                    x: item.date,
                    y: item.clicks
                }))
            }
        ];
    }, [userAnalytics, analyticsLoading]);

    const topLinks = userAnalytics?.analytics?.topLinks || [];

    return (
        <>
            <section className="relative">
                <div className="mb-4 flex justify-between items-center">
                    <div className="">
                        <h2 className="font-medium text-xl">Hey, {user.user.username}</h2>
                        <p className="text-sm text-neutral-content">Track your links and customize your bio links</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="select select-sm select-bordered bg-base-100"
                            value={analyticsPeriod}
                            onChange={(e) => setAnalyticsPeriod(e.target.value)}
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                    </div>
                </div>

                {/* Analytics Overview Cards */}
                <div className="w-full grid grid-cols-4 gap-4 h-[200px] mb-6">
                    <div className="flex-1 flex relative border border-base-300 rounded-md p-4">
                        <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-2 mb-1">
                                <LuMousePointer className="text-primary" size={16} />
                                <span className="text-2xl font-bold">{totalClicks}</span>
                            </div>
                            <p className="text-sm leading-3 text-neutral">Total clicks</p>
                        </div>
                        <div className="h-[130px] w-full mt-auto">
                            <MyResponsiveLine data={chartData}/>
                        </div>
                    </div>

                    <div className="flex-1 flex relative border border-base-300 rounded-md p-4">
                        <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-2 mb-1">
                                <LuLink2 className="text-secondary" size={16} />
                                <span className="text-2xl font-bold">
                                    {userAnalytics?.analytics?.overview?.totalLinks || 0}
                                </span>
                            </div>
                            <p className="text-sm leading-3 text-neutral">Total links</p>
                        </div>
                        <div className="h-[130px] w-full mt-auto flex items-end justify-center">
                            <div className="text-4xl opacity-20">
                                <LuLink2 />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex relative border border-base-300 rounded-md p-4">
                        <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-2 mb-1">
                                <LuTrendingUp className="text-accent" size={16} />
                                <span className="text-2xl font-bold">
                                    {userAnalytics?.analytics?.overview?.averageClicksPerLink || 0}
                                </span>
                            </div>
                            <p className="text-sm leading-3 text-neutral">Avg clicks/link</p>
                        </div>
                        <div className="h-[130px] w-full mt-auto flex items-end justify-center">
                            <div className="text-4xl opacity-20">
                                <LuTrendingUp />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex relative border border-base-300 rounded-md p-4">
                        <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-2 mb-1">
                                <LuBarChart className="text-info" size={16} />
                                <span className="text-2xl font-bold">
                                    {userAnalytics?.analytics?.overview?.period?.days || 0}
                                </span>
                            </div>
                            <p className="text-sm leading-3 text-neutral">Days tracked</p>
                        </div>
                        <div className="h-[130px] w-full mt-auto flex items-end justify-center">
                            <div className="text-4xl opacity-20">
                                <LuBarChart />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Performing Links */}
                {topLinks.length > 0 && (
                    <div className="mb-6 bg-base-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <LuTrendingUp className="text-primary" />
                            Top Performing Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topLinks.slice(0, 6).map((link, index) => (
                                <div key={link.short} className="bg-base-100 rounded-lg p-4 border border-base-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-primary">
                                            #{index + 1}
                                        </span>
                                        <span className="text-sm font-bold text-accent">
                                            {link.clicks} clicks
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-medium text-sm truncate">
                                            sneek.co/{link.short}
                                        </p>
                                        <p className="text-xs text-base-content/70 truncate">
                                            {link.longUrl}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-base-content/60">
                                        <span>
                                            Created: {new Date(link.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link
                                            to={`/analytics/${link.short}`}
                                            className="text-primary hover:text-primary-focus"
                                        >
                                            View details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div
                    className="sticky top-0 z-20 my-4 flex items-center gap-4 rounded-md border border-base-200 bg-base-200 px-4 py-1">
                    <div className="flex items-center gap-4">
                        <div className="">
                            <span>My Links</span>
                            <p className="text-sm text-base-content">{data?.urls.length} total links</p>
                        </div>
                        {activeFilter.length !== 0 &&
                            activeFilter?.map((filter) => (
                                <div
                                    key={Object.keys(filter)[0]}
                                    className="relative flex cursor-pointer items-center rounded-md border border-base-200 px-4 text-sm group py-0.5">
                                    <div
                                        className="absolute top-0 right-0 h-3 w-3 rounded-full bg-base-200 group-hover:bg-red-500"></div>
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
                            onClick={() => setOpenFilter(true)}
                        >
                            <p className="text-sm text-base-content">Filter</p>
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
