import {useState} from "react";
import {useAppSelector} from "../app/hook";

import BrowserShot from '../assets/706shots_so.png'
import {Link, Outlet} from "react-router-dom";
import UrlManager from "../features/url/urlmanager";
import {Url, useGetUrlsQuery} from "../app/services/urlapi";
import {LuForward, LuLink2, LuMoreVertical, LuQrCode} from "react-icons/lu";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import EditLinkModal from "../components/ui/modals/edit-link-modal";
import Portal from "../components/portal";
import {selectCurrentUser} from "../features/auth/authslice";
import {useUserPlan} from "../components/layout";

const URLs = "http://localhost:4080";

const HomeLinkItem = ({url, isAuthenticated, isFreePlan}: { url: Url, isAuthenticated: boolean, isFreePlan: boolean }) => {
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <>
        <div className="flex items-center justify-between rounded-lg bg-slate-300 px-4 py-2 h-[80px]">
            <div className="w-[70%]">
                <div className="flex items-center gap-2">
                    <Link
                        className="flex items-center gap-2 text-blue-700"
                        to={`http://localhost:4080/${url.short}`}
                    >
                        <LuLink2/>
                        sneek.co/{url.short}
                    </Link>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="">
                            <LuForward size={22}/>
                        </div>
                        <div className="">share</div>
                        <div className="">
                            <LuQrCode
                                size={22}
                                onClick={() => setOpen(true)}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-left">
                    <p className="truncate">{url.longUrl}</p>
                </div>
            </div>
            <div className="cursor-pointer">
                <LuMoreVertical
                    size={24}
                    onClick={() => isAuthenticated? setActive(true):null}
                />
            </div>
        </div>
            <Portal>
                <EditQrModal
                    url={url}
                    editQrActive={open}
                    setQrActive={setOpen}
                />

                <EditLinkModal
                    url={url}
                    setEditActive={setActive}
                    editActive={active}
                    plan=''
                />
            </Portal>
        </>
    );
};

const Landing = () => {
    const user = useAppSelector(selectCurrentUser);
    const { plan } = useUserPlan();
    const isAuthenticated = user.user.username !== "Guest";
    const isFreePlan = plan === 'free';
    const {data, isLoading, isSuccess} = useGetUrlsQuery("limit=5");

    return (
        <>
            <section className="container mx-auto flex flex-col justify-center p-4 text-center">
                <div className="mt-28">
                    <span className="rounded-full bg-red-500 px-4 py-1">+1k github</span>
                    <h1 className="mx-auto mt-5 text-7xl text-black max-w-[950px] dark:text-white">
                        Link small, connect big! Your shortcut to instant connections.
                    </h1>
                </div>

                <div className="mt-8">
                    <div className="mx-auto flex flex-col gap-8 max-w-[1000px] md:flex-row">
                        <div className="flex-1 rounded-lg bg-red-300 px-8 py-4 max-w-[468px]">
                            <h2 className="text-start text-2xl font-bold">Shorten a URL</h2>
                            <UrlManager/>
                        </div>

                        <div className="flex flex-1 flex-col gap-2 max-w-[468px]">
                            {/* Only show 4 of the users urls, if empty show 4 skeletons  */}
                            {isSuccess &&
                                data.urls?.map((url, index) => (
                                    <HomeLinkItem
                                        key={url._id}
                                        url={url}
                                        isAuthenticated={isAuthenticated}
                                        isFreePlan={isFreePlan}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-16 h-screen p-4">
                <img className="mx-auto w-[80%]" src={BrowserShot} alt="shot" />
            </section>

            <Portal>
                <Outlet/>
            </Portal>
        </>
    );
};

export default Landing;
