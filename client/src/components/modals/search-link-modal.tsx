import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {Sheet, SheetContent} from "../ui/sheet";
import Label from "../ui/label";
import Input from "../ui/Input";
import {LuSearch} from "react-icons/lu";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {getSiteUrl, getWebsiteName} from "../../Utils/getSiteUrl";
import {UseDebounce} from "../../hooks/use-debounce";
import {useSearchParams} from "react-router-dom";
import {useGetUrlsQuery} from "../../app/services/urlapi";
import Dialog, {DialogContent, DialogHeader, DialogTitle, DialogDescription} from "../ui/dialog";
import {AnimatePresence, motion} from "framer-motion";
import LinkCard from '../link-card';

type Props = {
    searchLinkActive: boolean;
    setSearchLinkActive: Dispatch<SetStateAction<boolean>>;
}

const SearchLinkModal = ({searchLinkActive, setSearchLinkActive}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string | null>('')
    const {control, handleSubmit, watch} = useForm<{ search: string }>(
        {
            defaultValues: {
                search: searchParams.get('search') || '',
            },
        },
    );
    const debounceValue = UseDebounce<string>(watch('search') as unknown as string)
    const {data, isLoading} = useGetUrlsQuery(searchTerm, {skip: searchTerm?.split('=')[1] == null})
    const search = searchParams.get('search');

    const handleSearch = useCallback((newParams: { [key: string]: string }) => {
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
        createQueryParams({search});
    }, [debounceValue]);

    useEffect(() => {
        if (!searchLinkActive) setSearchParams({});
    }, [searchLinkActive, setSearchParams]);

    return (
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
                            <DialogDescription className="text-zinc-400">Search your link</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="px-6 py-4">
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className=""
                    />
                    <motion.div
                        initial={{x: "100%"}}
                        animate={{x: 0}}
                        exit={{x: "100%"}}
                        transition={{type: "spring", damping: 25, stiffness: 200}}
                        className="w-full  border-l border-white/10 z-50"
                    >
                        <form
                            onKeyUp={handleSubmit(handleSearch)}
                        >
                            <div className="mt-8 flex flex-col gap-4">
                                <div>
                                    <Label classnames="block text-xs mb-2 ml-1 uppercase font-bold">Destination
                                        Url</Label>
                                    <Controller
                                        name="search"
                                        control={control}
                                        render={({field}) => (
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
                    </motion.div>
                </div>

                <AnimatePresence>
                    {searchLinkActive &&
                        <motion.div
                            className="w-full rounded-md border border-base-300 bg-base-200 p-4 mt-4"
                            // add animation for when the height grows and shrinks
                            initial={{height: 0}}
                            animate={{height: 'auto'}}
                            exit={{height: 0}}
                            transition={{duration: 0.3}}
                        >
                            {searchTerm?.split('=')[1] && !isLoading && data?.urls.map(url => (
                                <div
                                    className="flex cursor-pointer items-center rounded-md border border-base-300 px-4 text-sm py-1 hover: hover:ring-2 hover:ring-primary mt-1"
                                     key={url._id}
                                >
                                    {getWebsiteName(url.longUrl)}
                                </div>
                            ))}
                        </motion.div>}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
        ;
};

export default SearchLinkModal;
