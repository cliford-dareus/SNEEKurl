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
import Dialog, {DialogContent} from "../dialog";

type Props = {
    searchLinkActive: boolean;
    setSearchLinkActive: Dispatch<SetStateAction<boolean>>;
}

const SearchLinkModal = ({searchLinkActive, setSearchLinkActive}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string | null>('')
    const {control, handleSubmit,watch} = useForm<{ search: string }>();
    const debounceValue = UseDebounce<string>(watch('search') as unknown as string)
    const {data, isLoading} = useGetUrlsQuery(searchTerm, {skip: searchTerm?.split('=')[1] == '', refetchOnMountOrArgChange: true})
    const search = searchParams.get('search');

    const handleSearch = useCallback((newParams:  {[key: string]: string}) => {
        Object.entries(newParams).forEach(([key, value]) => {
            searchParams.set(key, value);
        });
        setSearchParams(searchParams);
    }, [])

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
        if(!searchLinkActive) setSearchParams('');
    }, [searchLinkActive]);

    return (
        <>
            {searchLinkActive &&
                <>
                    <Dialog open={searchLinkActive} onOpenChange={setSearchLinkActive}>
                    <DialogContent>
                        <div className="relative h-full w-[500px]">
                            <div
                                className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-base-300 p-4">
                                <svg width="40"
                                     height="40"
                                     viewBox="0 0 200 250"
                                     fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                                          fill="currentColor"/>
                                </svg>
                                <p className="mb-2 font-medium">Searching for Links</p>
                                <LuSearch size={24}/>
                            </div>

                            <form
                                action=""
                                className="h-full p-4 pt-24"
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
                                    {/*<Button classnames="self-start">Search</Button>*/}
                                </div>
                            </form>
                        </div>

                        {searchLinkActive &&
                            <div className="absolute w-full rounded-md border border-base-300 bg-base-200 p-4">
                                {searchTerm && !isLoading && data?.urls.map(url => (
                                    <li className="cursor-pointer" key={url._id}>{url.longUrl}</li>
                                ))}
                            </div>}
                    </DialogContent>
                    </Dialog>
                </>
            }
        </>
    );
};

export default SearchLinkModal;
