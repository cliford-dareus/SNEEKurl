import {getSiteUrl} from "../../Utils/getSiteUrl";
import {Dispatch, SetStateAction, useCallback, useEffect} from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useSearchParams} from "react-router-dom";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "../ui/dialog";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setActiveFilter: Dispatch<SetStateAction<any[]>>;
    activeFilter: any[];
};

const FilterLinkModal = ({open, setOpen, activeFilter, setActiveFilter}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // const updateSearchParams = useCallback(
    //     (newParams: { [key: string]: string }) => {
    //         Object.entries(newParams).forEach(([key, value]) => {
    //             searchParams.set(key, value);
    //         });
    //
    //         setSearchParams(searchParams);
    //
    //         if (activeFilter.length === 0) {
    //             setActiveFilter((prevState) => [...(prevState ?? []), newParams])
    //         } else if (activeFilter.length !== 0 &&
    //             activeFilter.filter(x => Object.keys(x)[0] == Object.keys(newParams)[0]).length !== 0 &&
    //             activeFilter.filter(x => Object.values(x)[0] == Object.values(newParams)[0]).length == 0
    //         ) {
    //             setActiveFilter(
    //                 [...activeFilter.filter(x => Object.keys(x)[0] !== Object.keys(newParams)[0]), newParams]);
    //         } else if (activeFilter.length !== 0 &&
    //             activeFilter.filter(x => Object.keys(x)[0] == Object.keys(newParams)[0]).length == 0) {
    //             setActiveFilter((prevState) => [...(prevState ?? []), newParams]);
    //
    //         }
    //     },
    //     [searchParams]
    // );

    const updateSearchParams = useCallback(
        (newParams: { [key: string]: string }) => {
            // Step 1: Update the search parameters
            Object.entries(newParams).forEach(([key, value]) => {
                searchParams.set(key, value);
            });
            setSearchParams(searchParams);

            // Step 2: Update the active filters
            const [newKey, newValue] = Object.entries(newParams)[0]; // Extract key-value pair from `newParams`

            setActiveFilter((prevState) => {
                const updatedFilters = prevState ?? [];

                // Check if a filter with the same key already exists
                const existingFilterIndex = updatedFilters.findIndex(
                    (filter) => Object.keys(filter)[0] === newKey
                );

                if (existingFilterIndex !== -1) {
                    // If the filter exists but has a different value, replace it
                    if (Object.values(updatedFilters[existingFilterIndex])[0] !== newValue) {
                        updatedFilters[existingFilterIndex] = newParams;
                    }
                } else {
                    // If the filter doesn't exist, add it
                    updatedFilters.push(newParams);
                }

                return [...updatedFilters];
            });
        },
        [searchParams]
    );


    useEffect(() => {
        if (!searchParams) {
            setActiveFilter([])
        }
    }, [searchParams]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                            <DialogTitle>Filter Links</DialogTitle>
                            <DialogDescription className="text-zinc-400">Filter links
                                by...</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                {/*<div className="relative h-full w-[400px]"></div>*/}

                <div className="p-4">
                    <Select
                        onValueChange={(value) => updateSearchParams({sort: value})}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Theme"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="asc">Old to New</SelectItem>
                                <SelectItem value="desc">New to Old</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(value) => updateSearchParams({clicks: value})}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Theme"/>
                        </SelectTrigger>
                        <SelectContent className="mt-2">
                            <SelectGroup>
                                <SelectItem value="light">Most Clicks</SelectItem>
                                <SelectItem value="dark">Less Clicks</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </DialogContent>
        </Dialog>


    );
};

export default FilterLinkModal;
