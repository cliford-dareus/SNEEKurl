import {useMemo, useState} from "react";
import {useGetUrlsQuery, useGetUserAnalyticsQuery} from "../app/services/urlapi";
import {Link} from "react-router-dom";
import {
    LuArrowDown,
    LuArrowUp,
    LuBarChart,
    LuFilter,
    LuLink2,
    LuTrendingUp,
    LuMousePointer,
} from "react-icons/lu";
import FilterLinkModal from "../components/modals/filter-link-modal";
import LinkItems from "../components/link-items";
import MyResponsiveLine from "../components/ui/responsive-line";
import {useAppSelector} from "../app/hook";
import {selectCurrentUser} from "../features/auth/authslice";
import useQuery from "../hooks/use-query";

const Dashboard = () => {
    let query = useQuery();
    const [openFilter, setOpenFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState<any[]>([]);
    const [analyticsPeriod, setAnalyticsPeriod] = useState('30d');
    const user = useAppSelector(selectCurrentUser)
    const {data, isLoading} = useGetUrlsQuery({search: query.get('search')});
    const {data: userAnalytics, isLoading: analyticsLoading} = useGetUserAnalyticsQuery(analyticsPeriod);

    const totalClicks = useMemo(() => {
        return userAnalytics?.analytics?.overview?.totalClicks || 0;
    }, [userAnalytics]);

    const chartData = useMemo(() => {
        if (!userAnalytics?.analytics?.clicksOverTime) return [];
        return [
            {
                "id": "Clicks",
                "color": "hsl(245, 60%, 52%)",
                "data": userAnalytics.analytics.clicksOverTime.map(item => ({
                    x: item.date,
                    y: item.clicks
                }))
            }
        ];
    }, [userAnalytics, analyticsLoading]);

    const topLinks = userAnalytics?.analytics?.topLinks || [];

    const statCards = [
        {
            icon: LuMousePointer,
            value: totalClicks,
            label: "Total clicks",
            iconClass: "bg-primary/10 text-primary",
        },
        {
            icon: LuLink2,
            value: userAnalytics?.analytics?.overview?.totalLinks || 0,
            label: "Total links",
            iconClass: "bg-chart-2/10 text-chart-2",
        },
        {
            icon: LuTrendingUp,
            value: userAnalytics?.analytics?.overview?.averageClicksPerLink || 0,
            label: "Avg clicks/link",
            iconClass: "bg-chart-5/10 text-chart-5",
        },
        {
            icon: LuBarChart,
            value: userAnalytics?.analytics?.overview?.period?.days || 0,
            label: "Days tracked",
            iconClass: "bg-chart-3/10 text-chart-3",
        },
    ];

    return (
        <>
            <section className="relative">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Hey, {user.user.username}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Track your links and customize your bio links</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="h-9 rounded-lg border border-input bg-card px-3 text-sm shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40"
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
                <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card, index) => (
                        <div
                            key={card.label}
                            className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">{card.label}</p>
                                    <p className="mt-1 text-3xl font-bold tracking-tight">{card.value}</p>
                                </div>
                                <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}>
                                    <card.icon size={18} />
                                </span>
                            </div>
                            {index === 0 ? (
                                <div className="mt-3 h-[64px] w-full">
                                    <MyResponsiveLine data={chartData} />
                                </div>
                            ) : (
                                <div className="pointer-events-none absolute -bottom-3 -right-2 text-[88px] leading-none opacity-[0.06]">
                                    <card.icon />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Top Performing Links */}
                {topLinks.length > 0 && (
                    <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold tracking-tight">
                            <LuTrendingUp className="text-primary" size={18} />
                            Top Performing Links
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {topLinks.slice(0, 6).map((link, index: number) => (
                                <div key={link.short} className="rounded-xl border border-border bg-muted/40 p-4 transition-shadow hover:shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-semibold text-primary">
                                            {link.clicks} clicks
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-medium text-sm truncate">
                                            sneek.co/{link.short}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {link.longUrl}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            Created: {new Date(link.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link
                                            to={`/analytics/${link.short}`}
                                            className="font-medium text-primary hover:text-primary/80"
                                        >
                                            View details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="sticky top-16 z-20 my-4 flex items-center gap-4 rounded-xl border border-border bg-card/90 px-4 py-2.5 shadow-sm backdrop-blur-md">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="shrink-0">
                            <span className="text-base font-semibold tracking-tight">My Links</span>
                            <p className="text-xs text-muted-foreground">{data?.urls.length} total links</p>
                        </div>
                        {activeFilter.length !== 0 &&
                            activeFilter?.map((filter) => (
                                <div
                                    key={Object.keys(filter)[0]}
                                    className="relative hidden cursor-pointer items-center gap-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground sm:flex">
                                    {Object.keys(filter)[0]}
                                    <div>
                                        {Object.values(filter)[0] == "asc" ||
                                        Object.values(filter)[0] == "most_click" ? (
                                            <LuArrowDown size={12} />
                                        ) : (
                                            <LuArrowUp size={12} />
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="ml-auto">
                        <div
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 shadow-sm transition-colors hover:bg-muted"
                            onClick={() => setOpenFilter(true)}
                        >
                            <p className="text-sm font-medium">Filter</p>
                            <LuFilter size={14} />
                        </div>
                    </div>
                </div>

                <LinkItems/>

                <FilterLinkModal
                    open={openFilter}
                    setOpen={setOpenFilter}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />
            </section>
        </>
    );
};

export default Dashboard;
