import React, {useState} from 'react';
import {useGetUrlsQuery} from "../app/services/urlapi";
import {LuArrowDown, LuArrowUp, LuFilter} from "react-icons/lu";
import LinkItems from "../components/link-items";
import Portal from "../components/portal";
import FilterLinkModal from "../components/ui/modals/filter-link-modal";

const Links = () => {
    const [openFilter, setOpenFilter] = useState(false);
    const [activeFilter, setActiveFilter] = useState<any[]>([]);
    // const user = useAppSelector((state: RootState) => state.auth);
    // const plan = useUserPlan();
    const {data, isLoading} = useGetUrlsQuery({});

    return (
        <div>
            <section className="relative">
                <div
                    className="sticky top-0 z-20 mb-4 flex items-center gap-4 rounded-md border border-base-200 bg-base-200 px-4 py-1">
                    <div className="flex gap-4 items-center">
                        <div className="">
                            <span>My Links</span>
                            <p className="text-xs text-base-content">{data?.urls.length} total links</p>
                        </div>
                        {activeFilter.length !== 0 &&
                            activeFilter?.map((filter) => (
                                <div
                                    className="relative flex cursor-pointer items-center rounded-md border border-base-200 px-4 text-sm group py-0.5">
                                    <div
                                        className="absolute top-0 right-0 h-3 w-3 rounded-full bg-base-100 group-hover:bg-red-500"></div>
                                    {Object.keys(filter)[0]}
                                    <div>
                                        {Object.values(filter)[0] == "asc" ||
                                        Object.values(filter)[0] == "most_click" ? (
                                            <LuArrowDown/>
                                        ) : (
                                            <LuArrowUp/>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="ml-auto">
                        <div
                            className="flex cursor-pointer items-center gap-2 rounded-full bg-base-200 px-4 py-0.5"
                            onClick={() => setOpenFilter(true)}
                        >
                            Filter
                            <LuFilter/>
                        </div>
                    </div>
                </div>

                <LinkItems/>

                <Portal>
                    <FilterLinkModal
                        open={openFilter}
                        setOpen={setOpenFilter}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />
                </Portal>
            </section>
        </div>
    );
};

export default Links;
