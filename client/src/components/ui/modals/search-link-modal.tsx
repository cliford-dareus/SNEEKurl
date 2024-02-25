import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {Sheet, SheetContent} from "../sheet";
import Label from "../label";
import Input from "../Input";
import {LuSearch} from "react-icons/lu";
import {SubmitHandler, useForm} from "react-hook-form";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import {UseDebounce} from "../../../Utils/hooks/use-debounce";
import {useSearchParams} from "react-router-dom";
import {useGetUrlsQuery} from "../../../app/services/urlapi";

type Props = {
    searchLinkActive: boolean;
    setSearchLinkActive: Dispatch<SetStateAction<boolean>>;
}
const SearchLinkModal = ({searchLinkActive, setSearchLinkActive}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string | null>('')
    const {register, handleSubmit,watch} = useForm<{ search: string }>();
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
                    <Sheet triggerFn={setSearchLinkActive}/>
                    <SheetContent
                        classnames="top-[20%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
                        <div className="w-[500px] h-full relative">
                            <div
                                className="w-full p-4 fixed top-0 left-0 right-0 bg-slate-200 rounded-tr-lg rounded-tl-lg flex flex-col justify-center items-center">
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                                        "https://www.notion.so/42ccaebd5905427b847a1c0b4db3882e?v=6b1a83d2d07743c4837422b34e513239"
                                    )}`}
                                    className="w-[30px]"
                                    alt=""
                                />
                                <p className="mb-2 font-medium">Searching for Links</p>
                                <LuSearch size={24}/>
                            </div>

                            <form
                                action=""
                                className="h-full pt-24 p-4"
                                onKeyUp={handleSubmit(handleSearch)}
                            >
                                <div className="flex flex-col gap-4 mt-8">
                                    <div>
                                        <Label>Destination Url</Label>
                                        <Input
                                            register={register}
                                            placeholder=""
                                            label="search"
                                            hidden={false}
                                        />
                                    </div>
                                    {/*<Button classnames="self-start">Search</Button>*/}
                                </div>
                            </form>
                        </div>

                        {searchLinkActive &&
                            <div className="absolute w-full p-4 bg-slate-100 border border-slate-200 rounded-md">
                                {searchTerm && !isLoading && data?.urls.map(url => (
                                    <li className="cursor-pointer" key={url._id}>{url.longUrl}</li>
                                ))}
                            </div>}
                    </SheetContent>
                </>
            }
        </>
    )
};

export default SearchLinkModal;