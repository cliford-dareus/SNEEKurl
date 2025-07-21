import {
    Url,
    useGetGuestUrlQuery,
    useGetUrlQuery,
    useGetUrlsQuery,
} from "../app/services/urlapi";
import {
    LuClock,
    LuLink2,
    LuMoreVertical,
    LuQrCode,
    LuShare2,
} from "react-icons/lu";
import {ReactNode, useEffect, useRef, useState} from "react";
import {useAppSelector} from "../app/hook";
import BrowserShot from "../assets/706shots_so.webp";
import {Outlet} from "react-router-dom";
import {BiCustomize, BiShareAlt} from "react-icons/bi";
import {MdOutlineSwitchAccessShortcut} from "react-icons/md";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import EditLinkModal from "../components/ui/modals/edit-link-modal";
import {selectCurrentUser} from "../features/auth/authslice";
import HomeCreateLinkManager from "../features/url/urllandingmanager";
import VisitLinkButton from "../components/visit-link-button";
import classNames from "classnames";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";
import Portal from "../components/portal";
import {useUserPlan} from "../components/layout/layout";
import {useInView} from "framer-motion";

const HomeLinkItem = ({
                          url,
                          isAuthenticated,
                          isFreePlan,
                      }: {
    url: Url;
    isAuthenticated: boolean;
    isFreePlan: boolean;
}) => {
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        expires: false,
    });

    useEffect(() => {
        const updateTimeLeft = () => {
            const expiredTime = new Date(url.expired_in!).getTime();
            const timeLeftMs = expiredTime - Date.now();
            const timeLeftSeconds = Math.max(timeLeftMs / 1000, 0); // Prevent negative values
            const hours = Math.floor(timeLeftSeconds / 3600);
            const minutes = Math.floor((timeLeftSeconds % 3600) / 60);
            setTimeLeft({hours, minutes, expires: Date.now() > expiredTime});
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div
                className={classNames(
                    timeLeft.expires ? "opacity-50" : "",
                    "flex items-center justify-between rounded-lg bg-slate-200 px-4 py-2 h-[60px] w-full",
                )}
            >
                <div className="w-[80%]">
                    <div className="flex items-center gap-2">
                        <VisitLinkButton url={url}>
                            <div className="flex items-center gap-2 text-blue-700">
                                <LuLink2 size={20}/>
                                sneek.co/{url.short}
                            </div>
                        </VisitLinkButton>
                        <div className="ml-auto flex items-center gap-4">
                            <div className="">
                                <LuShare2 size={18} className="cursor-pointer"/>
                            </div>
                            <div className="">
                                <LuQrCode
                                    size={18}
                                    onClick={() => setOpen(true)}
                                    className="cursor-pointer"
                                />
                            </div>

                            {!isAuthenticated && (
                                <TooltipProvider>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-1">
                                            <LuClock size={20}/>
                                            {timeLeft.hours === 0 ? "" : `${timeLeft.hours} hours`}
                                            {timeLeft.minutes}m
                                        </div>
                                    </TooltipTrigger>
                                    <div className="relative">
                                        <Tooltip content="Tooltip content" direction="bottom"/>
                                    </div>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    <div className="text-left">
                        <p className="truncate">{url.longUrl}</p>
                    </div>
                </div>
                <div className="cursor-pointer flex items-center">
                    <LuMoreVertical
                        size={24}
                        onClick={() => (isAuthenticated ? setActive(true) : null)}
                    />
                </div>
            </div>

            <Portal>
                <EditQrModal url={url} editQrActive={open} setQrActive={setOpen}/>
                <EditLinkModal
                    url={url}
                    setEditActive={setActive}
                    editActive={active}
                    plan=""
                />
            </Portal>
        </>
    );
};

const Section = ({children}: { children: ReactNode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: true});

    return (
        <div className="h-1/3 py-4" ref={ref}>
            <div
                style={{
                    transform: isInView ? "none" : "translateY(200px)",
                    opacity: isInView ? 1 : 0,
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                }}
                className="sticky h-fit p-4 top-[30%] rounded-md flex items-center"
            >
                <h3 className="text-5xl font-medium">{children}</h3>
            </div>
        </div>
    );
};

const Landing = () => {
    const {plan} = useUserPlan();
    const isFreePlan = plan === "free";
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = user.user.username;
    const {data, isSuccess} = useGetUrlsQuery("limit=5");

    return (
        <>
            <section className="container mx-auto flex flex-col justify-center p-4 text-center">
                <div className="mt-28">
          <span className="rounded-full bg-indigo-500 px-4 py-1 text-white">
            +1k github
          </span>
                    <p className="mt-4 text-bold text-xl">
                        Your shortcut to instant connections.
                    </p>
                    <h1 className="mx-auto text-7xl text-black max-w-[800px] dark:text-white">
                        Link small, connect big!
                    </h1>
                </div>

                <div className="mt-4">
                    <div className="mx-auto flex flex-col gap-4 max-w-[500px] w-full">
                        <div className="w-full">
                            <HomeCreateLinkManager
                                isAuthenticated={isAuthenticated}
                                isFreePlan={isFreePlan}
                            />
                        </div>
                        <div className="flex flex-col gap-2 max-w-[500px] mx-auto w-full">
                            {data?.urls
                                    .slice(0, 3)
                                    .map((url) => (
                                        <HomeLinkItem
                                            key={url._id}
                                            url={url}
                                            isAuthenticated={!!isAuthenticated}
                                            isFreePlan={isFreePlan}
                                        />
                                    ))
                               }
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-8">
                    <img className="" src={BrowserShot} alt="shot"/>
                </div>
            </section>

            <section className="container mx-auto mt-16 p-4 bg-indigo-500 rounded-md text-white relative">

            </section>
            <Portal>
                <Outlet/>
            </Portal>
        </>
    );
};

export default Landing;
