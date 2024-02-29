import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {LuChevronDown} from "react-icons/lu";
import {UseFormSetValue} from "react-hook-form";
import {CreateLinkInBioProp} from "./modals/create-link-in-bio-modal";
import {useGetUrlsQuery} from "../../app/services/urlapi";


type  Props = {
    setvalues: UseFormSetValue<CreateLinkInBioProp & { links: string[] }>;
}

const MultiSelect = ({setvalues}: Props) => {
    const {data, isLoading} = useGetUrlsQuery({})
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    const handleSelectChange = (item: string) => {
        const isNotSelected = selectedItems.indexOf(String(item)) === -1;
        if (isNotSelected) {
            setSelectedItems(((props: string[]) => [...props, String(item)]));
        }
    };

    useEffect(() => {
        setvalues("links", selectedItems);
    }, [selectedItems]);

    return (
        <div className="relative">
            <div
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center px-4 w-full h-8 rounded-md bg-white hover:ring-2 hover:ring-indigo-500"
            >
                {selectedItems.length > 0 ? <div className="w-[90%] overflow-hidden flex gap-2 items-center">
                    {selectedItems.map((item, index) => (
                        <div
                            key={index}
                            className="py-0.5 px-2 cursor-pointer bg-slate-200 rounded-md text-sm"
                        >
                            {item}
                        </div>
                    ))}
                </div> : <p>Select</p>}
                <LuChevronDown/>
            </div>

            <div className="relative">
                {open && <div className="absolute top-2 bg-slate-100 w-full z-20">
                    {!isLoading && data?.urls.map((item) => (
                        <div
                            className="flex hover: cursor-pointer items-center rounded-md border border-slate-200 px-4 text-sm py-0.5 hover:ring-2 hover:ring-indigo-500"
                            key={item._id}
                            onClick={() => handleSelectChange(item._id)}
                        >
                            {item.longUrl}
                        </div>
                    ))}
                </div>}
            </div>


        </div>
    )
};

export default MultiSelect;