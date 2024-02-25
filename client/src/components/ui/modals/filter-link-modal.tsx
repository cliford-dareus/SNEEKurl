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

    const updateSearchParams = useCallback(
        (newParams: { [key: string]: string }) => {
            Object.entries(newParams).forEach(([key, value]) => {
                searchParams.set(key, value);
            });

            setSearchParams(searchParams);

            if (activeFilter.length === 0) {
                setActiveFilter((prevState) => [...(prevState ?? []), newParams])
            } else if (activeFilter.length !== 0 &&
                activeFilter.filter(x => Object.keys(x)[0] == Object.keys(newParams)[0]).length !== 0 &&
                activeFilter.filter(x => Object.values(x)[0] == Object.values(newParams)[0]).length == 0
            ) {
                setActiveFilter([...activeFilter.filter(x => Object.keys(x)[0] !== Object.keys(newParams)[0]), newParams]);
            } else if (activeFilter.length !== 0 &&
                activeFilter.filter(x => Object.keys(x)[0] == Object.keys(newParams)[0]).length == 0) {
                setActiveFilter((prevState) => [...(prevState ?? []), newParams]);

            }
        },
        [searchParams]
    );

    useEffect(() => {
        if (!searchParams.size) setActiveFilter([])
    }, [searchParams]);

    return (
        <>
            {open && (
                <>
                    <Sheet triggerFn={setOpen}/>
                    <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
                        <div className="relative h-full w-[400px]">
                            <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-slate-200 p-4">
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                                        "https://www.notion.so/42ccaebd5905427b847a1c0b4db3882e?v=6b1a83d2d07743c4837422b34e513239"
                                    )}`}
                                    className="w-[30px]"
                                    alt=""
                                />
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
