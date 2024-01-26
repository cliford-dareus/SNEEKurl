import { ChangeEvent, FormEvent, useState } from "react";
import { useAppSelector } from "../app/hook";
// import { useAddUrlMutation, useGetUrlsQuery } from "../features/urlslice";
import type { RootState } from "../app/store";

import { Outlet } from "react-router-dom";
import Urlform from "../components/urlform";
import Qrform from "../components/qrform";

const Dashboard = () => {
  return (
    <>
      <section className="container mx-auto p-4 flex justify-center text-center flex-col relative">
        <div className="mt-28">
          <span className="px-4 py-1 bg-red-500 rounded-full">+1k github</span>
          <h1 className="text-7xl mt-5 max-w-[950px] mx-auto">
            Link small, connect big! Your shortcut to instant connections.
          </h1>
        </div>

        <div className="mt-8">
          <div className="flex flex-col md:flex-row mx-auto gap-8  max-w-[950px] ">
            <div className="max-w-[450px] flex-1 bg-red-300 py-4 px-8 rounded-lg">
              <h2 className="text-start font-bold text-2xl">Shorten a URL</h2>
              <Urlform />
            </div>

            <div className="max-w-[450px] flex-1 bg-red-300 py-4 px-8 rounded-lg">
              <h2 className="text-start font-bold text-2xl">
                Create a QR Code
              </h2>
              <Qrform />
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
