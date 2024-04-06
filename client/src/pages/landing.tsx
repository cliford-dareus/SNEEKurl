import { useState } from "react";
import { useAppSelector } from "../app/hook";

import BrowserShot from "../assets/706shots_so.png";
import { Outlet } from "react-router-dom";
import { Url, useGetUrlsQuery } from "../app/services/urlapi";
import { LuLink2, LuMoreVertical, LuQrCode } from "react-icons/lu";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import EditLinkModal from "../components/ui/modals/edit-link-modal";
import Portal from "../components/portal";
import { selectCurrentUser } from "../features/auth/authslice";
import { useUserPlan } from "../components/layout";
import HomeCreateLinkManager from "../features/url/urllandingmanager";
import VisitLinkButton from "../components/visit-link-button";

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

  return (
    <>
      <div className="flex items-center justify-between rounded-lg bg-slate-200 px-4 py-2 h-[60px]">
        <div className="w-[80%]">
          <div className="flex items-center gap-2">
            <VisitLinkButton url={url}>
              <div className="flex items-center gap-2 text-blue-700">
                <LuLink2 />
                sneek.co/{url.short}
              </div>
            </VisitLinkButton>
            <div className="ml-auto flex items-center gap-4">
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
            onClick={() => (isAuthenticated ? setActive(true) : null)}
          />
        </div>
      </div>

      <Portal>
        <EditQrModal url={url} editQrActive={open} setQrActive={setOpen} />
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

const Landing = () => {
  const user = useAppSelector(selectCurrentUser);
  const { plan } = useUserPlan();
  const isAuthenticated = user.user.username !== "Guest";
  const isFreePlan = plan === "free";
  const { data, isLoading, isSuccess } = useGetUrlsQuery("limit=5");

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
          <div className="mx-auto flex flex-col gap-4 max-w-[500px]">
            <div className="w-full">
              <HomeCreateLinkManager
                isAuthenticated={isAuthenticated}
                isFreePlan={isFreePlan}
              />
            </div>
            <div className="flex flex-col gap-2 max-w-[500px] mx-auto">
              {data?.urls.slice(0, 3).map((url) => (
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

        <div className="flex justify-center items-center mt-4">
          <img className="" src={BrowserShot} alt="shot" />
          {/* <img className="" src={BrowserShot} alt="shot" /> */}
        </div>
      </section>

      <section className="container mx-auto mt-16 h-screen p-4"></section>

      <section></section>

      <Portal>
        <Outlet />
      </Portal>
    </>
  );
};

export default Landing;
