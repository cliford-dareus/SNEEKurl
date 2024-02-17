import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppSelector } from "../app/hook";
// import { useAddUrlMutation, useGetUrlsQuery } from "../features/urlslice";
import type { RootState } from "../app/store";

import { Link, Outlet } from "react-router-dom";
import UrlManager from "../features/url/urlmanager";
import { useGetUrlsQuery } from "../app/services/urlapi";
import { LuForward, LuLink2, LuMoreVertical, LuQrCode } from "react-icons/lu";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import EditLinkModal from "../components/ui/modals/edit-link-modal";

const URLs = "http://localhost:4080";

const HomeLinkItem = ({ url }: { url: any }) => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="h-[80px] bg-slate-300 rounded-lg py-2 px-4 flex justify-between items-center">
      <div className="w-[70%]">
        <div className="flex items-center gap-2">
          <Link
            className="text-blue-700 flex gap-2 items-center"
            to={`http://localhost:4080/${url.short}`}
          >
            <LuLink2 />
            sneek.co/{url.short}
          </Link>
          <div className="flex items-center ml-auto gap-4">
            <div className="">
              <LuForward size={22} />
            </div>
            <div className="">share</div>
            <div className="">
              <LuQrCode
                size={22}
                onClick={() => setOpen(true)}
                className="cursor-pointer"
              />

              <EditQrModal
                url={url}
                editQrActive={open}
                setQrActive={setOpen}
              />
            </div>
          </div>
        </div>

        <div className=" text-left">
          <p className="truncate">{url.longUrl}</p>
        </div>
      </div>
      <div className="">
        <LuMoreVertical size={24} onClick={() => setActive(true)} />

        <EditLinkModal
          url={url}
          setEditActive={setActive}
          editActive={active}
        />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, isSuccess } = useGetUrlsQuery(null);
  

  return (
    <>
      <section className="container mx-auto p-4 flex justify-center text-center flex-col">
        <div className="mt-28">
          <span className="px-4 py-1 bg-red-500 rounded-full">+1k github</span>
          <h1 className="text-black dark:text-white text-7xl mt-5 max-w-[950px] mx-auto">
            Link small, connect big! Your shortcut to instant connections.
          </h1>
        </div>

        <div className="mt-8">
          <div className="flex flex-col md:flex-row mx-auto gap-8  max-w-[1000px] ">
            <div className="max-w-[468px] flex-1 bg-red-300 py-4 px-8 rounded-lg">
              <h2 className="text-start font-bold text-2xl">Shorten a URL</h2>
              <UrlManager />
            </div>

            <div className="max-w-[468px] flex-1 flex flex-col gap-2">
              {/* Only show 4 of the users urls, if empty show 4 skeletons  */}
              {isSuccess &&
                data.urls?.map((url, index) => <HomeLinkItem url={url} />)}
            </div>
          </div>
        </div>

        <div className="">
          <Outlet />
        </div>
      </section>

      <section className="container mx-auto p-4 h-screen mt-16">
        <h2>Features</h2>
      </section>
    </>
  );
};

export default Dashboard;
