import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { UseFormSetValue } from "react-hook-form";
import { CreateLinkInBioProp } from "./modals/create-link-in-bio-modal";
import { useGetUrlsQuery } from "../../app/services/urlapi";
import Input from "./Input";

type Props = {
  setvalues: UseFormSetValue<CreateLinkInBioProp & { links: string[] }>;
};

const MultiSelect = ({
  setvalues,
}: {
  setvalues: UseFormSetValue<CreateLinkInBioProp & { links: string[] }>;
}): JSX.Element => {
  const { data, isLoading } = useGetUrlsQuery({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleSelectChange = (item: string): void => {
    const isNotSelected = selectedItems.indexOf(item) === -1;
    if (isNotSelected) {
      setSelectedItems((prevItems: string[]) => [...prevItems, item]);
    }
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
        className="flex h-8 w-full items-center justify-between rounded-full bg-accent px-4 hover:ring-2 hover:ring-primary"
      >
        {selectedItems.length > 0 ? (
          <div className="flex items-center gap-2 overflow-hidden w-[90%]">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-md bg-base-200 px-2 text-sm py-0.5"
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p>Select</p>
        )}
        <LuChevronDown />
      </div>

      <div className="relative bg-base-200">
        {open && (
          <div className="w-full h-[300px] overflow-y-scroll bg-base-200 no-scrollbar">
            <div className="relative mb-10">
                <Input
                    className=""
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                />
            </div>
            {!isLoading &&
              filterDate?.map((item, index) => (
                <div
                  className=" flex cursor-pointer items-center rounded-md border border-base-300 px-4 text-sm py-0.5 hover: hover:ring-2 hover:ring-primary mt-1"
                  key={index}
                  onClick={() => handleSelectChange(item._id)}
                >
                  {item.longUrl}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
