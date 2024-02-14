import React, { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import Header from "../components/Header";
import { useGetUrlsQuery } from "../app/services/urlapi";
import { Link, useSearchParams } from "react-router-dom";
import { LuLink2 } from "react-icons/lu";

const LinkTems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState<string | null>("");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");

  const { data, isLoading } = useGetUrlsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const createQueryParams = (s: { [key: string]: string | null }) => {
      let str = [];
      for (const [key, value] of Object.entries(s)) {
        if (value === null) {
          continue;
        } else {
          str.push(`${key}=${value}`);
        }
      }
      setQueryParams(str.join("&"));
    };

    createQueryParams({ page, sort });
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4">
      {!isLoading &&
        data?.urls.map((url) => (
          <div className="h-[100px] bg-slate-300 rounded-lg p-4 flex gap-4 items-center">
            <div>Image</div>
            <div className="w-[80%]">
              <div className="flex items-center gap-4">
                <Link
                  className="text-blue-700 flex gap-2 items-center"
                  to={`http://localhost:4080/${url.short}`}
                >
                  <LuLink2 />
                  sneek.co/{url.short}
                </Link>

                <div className="ml-24">stats(clicks, analytics ...)</div>
              </div>

              <p className="truncate">{url.longUrl}</p>
              <div>Buttons</div>
            </div>

            <div className="ml-auto">edit</div>
          </div>
        ))}
    </div>
  );
};

const Favorite = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAppSelector((state: RootState) => state.auth);

  const updateSearchParams = useCallback(
    (newParams: { [key: string]: string }) => {
      Object.entries(newParams).forEach(([key, value]) => {
        searchParams.set(key, value);
      });

      setSearchParams(searchParams);
    },
    []
  );

  return (
    <>
      <section className="">
        <div>
          <button onClick={() => updateSearchParams({ sort: "1234" })}>
            set
          </button>
          <button onClick={() => updateSearchParams({ page: "2" })}>
            page
          </button>
        </div>
        <LinkTems />
      </section>
    </>
  );
};

export default Favorite;
