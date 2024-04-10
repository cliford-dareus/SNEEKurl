import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetPageQuery } from "../app/services/page";
import { getSiteUrl } from "../Utils/getSiteUrl";
import classNames from "classnames";

const URL = "http://localhost:4080";

const LinksInBio = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetPageQuery({ id: slug });

  return (
    <main className="">
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4 items-center">
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="w-[90px] h-[90px] rounded-full bg-indigo-500 border overflow-hidden">
              <img
                src={
                  "https://utfs.io/f/ffcca2f3-d293-4543-824a-aa752d3fd536_th.jpg"
                }
              />
            </div>
            <div className="mt-4">
              <p className="text-xl font-medium">@{data?.user.username}</p>
              <p className="my-2">{data?.description}</p>
            </div>
            <div className="mt-2 flex gap-2">
              {data?.links?.map(({ _id: link, category }: any) => {
                if (category === "social")
                  return (
                    <div
                      key={link._id}
                      className="w-[30px] h-[30px] rounded-full border overflow-hidden"
                    >
                      <Link to={link.short} target="_blank">
                        <img
                          className="w-full h-full object-cover"
                          src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                            link.longUrl
                          )}`}
                        />
                      </Link>
                    </div>
                  );
              })}
            </div>
          </div>

          <div className="w-full">
            {!isLoading &&
              data?.links?.map(({ _id: link, category }: any) => {
                if (category === "website" || category === "marketing") {
                  return (
                    <div
                      className={classNames(
                        category === "website"
                          ? "bg-indigo-300"
                          : "bg-green-300",
                        "w-full flex items-center gap-4 mt-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-2"
                      )}
                      key={link._id}
                    >
                      <div className="w-[30px] h-[30px] rounded-full  overflow-hidden">
                        <img
                          className="w-full h-full"
                          src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                            link.longUrl
                          )}`}
                        />
                      </div>

                      <p>{getSiteUrl(link.longUrl)}</p>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LinksInBio;
