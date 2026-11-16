import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetUrlsQuery } from "../app/services/urlapi";
import LinkCard from "./link-card";
import { useUserPlan } from "./layout/admin-layout";

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
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[68px] animate-pulse rounded-lg border border-border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (!data?.urls?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">No links yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create your first short link to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.urls.map((url) => (
        <LinkCard key={url._id} url={url} plan={plan.plan!} />
      ))}
    </div>
  );
};

export default LinkItems;
