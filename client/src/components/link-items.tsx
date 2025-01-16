import React, {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {useGetUrlsQuery} from "../app/services/urlapi";
import LinkCard from "./link-card";

const LinkItems = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [queryParams, setQueryParams] = useState<string | null>("");

    const sort = searchParams.get("sort");
    const page = searchParams.get("page");
    const clicks = searchParams.get("clicks");

    const skip = useMemo(
        () => queryParams?.split("").every((x) => x !== ""),
        [queryParams],
    );

    const { data, isLoading } = useGetUrlsQuery(queryParams, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: skip,
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

        createQueryParams({ page, sort, clicks });
    }, [searchParams, page, sort, clicks]);

    return (
        <div className="flex flex-col gap-4 no-scrollbar">
            {!isLoading &&
                data?.urls.map((url) => <LinkCard key={url._id} url={url} />)}
        </div>
    );
};

export default LinkItems;