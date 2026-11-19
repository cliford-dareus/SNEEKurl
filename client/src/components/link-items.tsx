import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetUrlsQuery } from "../app/services/urlapi";
import LinkCard from "./link-card";
import { useUserPlan } from "./layout/admin-layout";
import { LuLink2 } from "react-icons/lu";

const LinkItems = () => {
  const plan = useUserPlan();
  const [searchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState<string | null>("");

  const sort = searchParams.get("sort");
  const page = searchParams.get("page");
  const clicks = searchParams.get("clicks");

  const skip = useMemo(
    () => queryParams?.split("").every((x) => x !== ""),
    [queryParams]
  );

  const { data, isLoading } = useGetUrlsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: skip,
  });

  useEffect(() => {
    const createQueryParams = (s: { [key: string]: string | null }) => {
      const str = [];
      for (const [key, value] of Object.entries(s)) {
        if (value === null) continue;
        str.push(`${key}=${value}`);
      }
      setQueryParams(str.join("&"));
    };

    createQueryParams({ page, sort, clicks });
  }, [searchParams, page, sort, clicks]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[76px] animate-pulse rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (!data?.urls?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center shadow-sm">
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LuLink2 size={22} />
        </span>
        <p className="text-sm font-medium">No links yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create your first short link to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.urls.map((url) => (
        <LinkCard key={url._id} url={url} plan={plan.plan!} />
      ))}
    </div>
  );
};

export default LinkItems;
