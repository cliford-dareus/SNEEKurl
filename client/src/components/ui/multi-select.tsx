import React, {useCallback, useEffect, useMemo, useState} from "react";
import {LuChevronDown} from "react-icons/lu";
import {UseFormSetValue} from "react-hook-form";
import {CreateLinkInBioProp} from "../modals/create-link-in-bio-modal";
import {useGetUrlsQuery} from "../../app/services/urlapi";
import Input from "./Input";
import {getWebsiteName} from "../../Utils/getSiteUrl";

type Props = {
    setvalues: UseFormSetValue<CreateLinkInBioProp & { links: string[] }>;
};

const MultiSelect = ({
                         setvalues,
                     }: {
    setvalues: UseFormSetValue<CreateLinkInBioProp & { links: {_id: string, url: string, name: string }[] }>;
}): JSX.Element => {
    const {data, isLoading} = useGetUrlsQuery({});
    const [selectedItems, setSelectedItems] = useState<{_id: string, url: string, name: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const handleSelectChange = (item: string): void => {
        if (!data) return;
        const isSelected = data.urls.filter((i) => i._id === item)[0];
        const isAlreadySelected = selectedItems.some((i) => i.url === isSelected.longUrl);
        if (isAlreadySelected) return;
        setSelectedItems((prevItems) => [...prevItems, {
            _id: isSelected._id,
            url: isSelected.longUrl,
            name: getWebsiteName(isSelected.longUrl)!
        }]);
    };

    const removeSelectUrl = () => {

    };

    useEffect(() => {
        setvalues("links", selectedItems);
    }, [selectedItems, setvalues]);

    const filterDate = useMemo(() => {
        if (data?.urls && searchTerm) {
            return data?.urls.filter((item) => item.longUrl.includes(searchTerm));
        }
        return data?.urls;
    }, [data?.urls, searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="relative">
            <div
                onClick={() => setOpen(!open)}
                className="flex h-10 w-full items-center justify-between rounded-full bg-zinc-200 px-4 hover:ring-2 hover:ring-accent"
            >
                {selectedItems.length > 0 ? (
                    <div className="flex items-center gap-2 overflow-hidden w-full">
                        {selectedItems.map((item, index) => (
                            <div
                                key={index}
                                className="cursor-pointer rounded-md bg-base-200 px-2 text-sm py-0.5 relative"
                            >
                                {item.name}
                                <button
                                    type="button"
                                    // onClick={}
                                    className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Select</p>
                )}
                <LuChevronDown/>
            </div>

            <div className="relative bg-base-200 mt-4">
                {open && (
                    <div className="w-full h-[300px] p-4 overflow-y-scroll bg-base-200 no-scrollbar">
                        <div className="relative mb-6">
                            <Input
                                className=""
                                type="text"
                                placeholder="Search"
                                onChange={handleSearch}
                            />
                        </div>
                        {!isLoading &&
                            filterDate?.map((item, index) => (
                                <div className="flex cursor-pointer items-center rounded-md border border-base-300 px-4 text-sm py-1 mt-1 hover: hover:ring-2 hover:ring-primary mt-1"
                                    key={index}
                                    onClick={() => handleSelectChange(item._id)}
                                >
                                    {getWebsiteName(item.longUrl)}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiSelect;
