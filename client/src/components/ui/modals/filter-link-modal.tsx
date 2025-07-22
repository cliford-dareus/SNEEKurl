import {Sheet, SheetContent} from "../sheet";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import {Dispatch, SetStateAction, useCallback, useEffect} from "react";
import {Option, Select} from "../select";
import {useSearchParams} from "react-router-dom";
import {set} from "react-hook-form";

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
        if (!searchParams.size) {
            setActiveFilter([])
        }
    }, [searchParams]);

    return (
        <>
            {open && (
                <>
                    <Sheet triggerFn={setOpen}/>
                    <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-base-200">
                        <div className="relative h-full w-[400px]">
                            <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-base-300 p-4">
                                <svg width="40"
                                     height="40"
                                     viewBox="0 0 200 250"
                                     fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                                          fill="currentColor"/>
                                </svg>
                                <p>Filter</p>
                            </div>
                        </div>

                        <div className="mt-24 p-4">
                            <Select
                                classnames=""
                                onChange={(e) => updateSearchParams({sort: e.target.value})}
                            >
                            <Option>Sort by date</Option>
                                <Option value="asc">Old to New</Option>
                                <Option classnames="mt-2"
                                        value="desc">
                                    New to Old
                                </Option>
                            </Select>

                            <Select
                                classnames="mt-2"
                                onChange={(e) => updateSearchParams({clicks: e.target.value})}
                            >
                                <Option>Sort by clicks</Option>
                                <Option value="most_click">Most Click</Option>
                                <Option value="less_click">Less Click</Option>
                            </Select>
                        </div>
                    </SheetContent>
                </>
            )}
        </>
    );
};

export default FilterLinkModal;
