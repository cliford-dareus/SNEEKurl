import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {Sheet, SheetContent} from "../sheet";
import Label from "../label";
import Input from "../Input";
import {LuSearch} from "react-icons/lu";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import {UseDebounce} from "../../../hooks/use-debounce";
import {useSearchParams} from "react-router-dom";
import {useGetUrlsQuery} from "../../../app/services/urlapi";
import Dialog, {DialogContent, DialogHeader, DialogTitle, DialogDescription} from "../dialog";
import {motion} from "framer-motion";
import LinkCard from '../../link-card';

type Props = {
    searchLinkActive: boolean;
    setSearchLinkActive: Dispatch<SetStateAction<boolean>>;
}

const SearchLinkModal = ({searchLinkActive, setSearchLinkActive}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string | null>('')
    const {control, handleSubmit,watch} = useForm<{ search: string }>();
    const debounceValue = UseDebounce<string>(watch('search') as unknown as string)
    const {data, isLoading} = useGetUrlsQuery(searchTerm, {skip: searchTerm?.split('=')[1] == null})
    const search = searchParams.get('search');

    const handleSearch = useCallback((newParams:  {[key: string]: string}) => {
        const updatedParams = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            updatedParams.set(key, value);
        });
        setSearchParams(updatedParams);
    }, [searchParams, setSearchParams])

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
            setSearchTerm(str.join("&"));
        };
        createQueryParams({ search });
    }, [debounceValue]);

    useEffect(() => {
        if(!searchLinkActive) setSearchParams({});
    }, [searchLinkActive, setSearchParams]);

    return (
        <>
            {searchLinkActive &&
                <>
                    <Dialog open={searchLinkActive} onOpenChange={setSearchLinkActive}>
                    <DialogContent>
                            <DialogHeader>
                    <div className="flex items-center gap-3">
                                        <svg
                                          width="40"
                                          height="40"
                                          viewBox="0 0 200 250"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                                            fill="currentColor"
                                          />
                                        </svg>
                                        <div>
                                          <DialogTitle>Search Link</DialogTitle>
                                          <DialogDescription>Search your link</DialogDescription>
                                        </div>
                                      </div>
                </DialogHeader>
                        <div className="px-6 py-4">
                            <form
                                onKeyUp={handleSubmit(handleSearch)}
                            >
                                <div className="mt-8 flex flex-col gap-4">
                                    <div>
                                        <Label>Destination Url</Label>
                                        <Controller
                                            name="search"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="https://"
                                                    pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                                                    title="Must be valid URL"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {searchLinkActive &&
                            <motion.div
                                className="w-full rounded-md border border-base-300 bg-base-200 p-4 mt-4"
                                // add animation for when the height grows and shrinks
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {searchTerm?.split('=')[1] && !isLoading && data?.urls.map(url => (
                                    <li className="cursor-pointer" key={url._id}>{url.longUrl} </li>
                                    // <LinkCard key={url._id} url={url} plan={'free'} />
                                ))}
                            </motion.div>}
                    </DialogContent>
                    </Dialog>
                </>
            }
        </>
    );
};

export default SearchLinkModal;
