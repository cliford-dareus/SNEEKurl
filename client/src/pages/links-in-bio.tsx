import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPageQuery } from "../app/services/page";
import { getSiteUrl } from "../Utils/getSiteUrl";

const URL = "http://localhost:4080";

const LinksInBio = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetPageQuery({ id: slug });

  return (
    <main className="">
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4 items-center">
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="w-[90px] h-[90px] rounded-full bg-indigo-500"></div>
            <div className="mt-4">
              <p className="text-xl font-medium">@{data?.user.username}</p>
              <p className="my-2">{data?.description}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="w-[30px] h-[30px] rounded-full border border-indigo-500"></div>
              <div className="w-[30px] h-[30px] rounded-full border border-indigo-500"></div>
              <div className="w-[30px] h-[30px] rounded-full border border-indigo-500"></div>
              <div className="w-[30px] h-[30px] rounded-full border border-indigo-500"></div>
            </div>
          </div>

          <div className="w-full">
            {!isLoading &&
              data?.links?.map(({ _id, category }: any) => (
                <div
                  className="w-full flex items-center gap-4 mt-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-2"
                  key={_id._id}
                >
                  <div className="w-[30px] h-[30px] rounded-full  overflow-hidden">
                    <img
                      className="w-full h-full"
                      src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                        _id.longUrl
                      )}`}
                    />
                  </div>

                  <p>{_id.short}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LinksInBio;
