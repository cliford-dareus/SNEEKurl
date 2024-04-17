import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { UseFormSetValue } from "react-hook-form";
import { CreateLinkInBioProp } from "./modals/create-link-in-bio-modal";
import { useGetUrlsQuery } from "../../app/services/urlapi";

type Props = {
  setvalues: UseFormSetValue<CreateLinkInBioProp & { links: string[] }>;
};

/**
 * Renders a multi-select component.
 *
 * @param props - The component props.
 * @param props.setvalues - The function to set form values.
 * @returns The rendered multi-select component.
 */
const MultiSelect = ({
  setvalues,
}: {
  setvalues: UseFormSetValue<CreateLinkInBioProp & { links: string[] }>;
}): JSX.Element => {
  const { data, isLoading } = useGetUrlsQuery({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Handles the select change event.
   *
   * @param item - The selected item.
   */
  const handleSelectChange = (item: string): void => {
    const isNotSelected = selectedItems.indexOf(item) === -1;
    if (isNotSelected) {
      setSelectedItems((prevItems: string[]) => [...prevItems, item]);
    }
  };

  /**
   * Sets form values when selected items change.
   */
  useEffect(() => {
    setvalues("links", selectedItems);
  }, [selectedItems, setvalues]);

  /**
   * Filter URLs based on search term.
   */
  const filterDate = useMemo(() => {
    if (data?.urls && searchTerm) {
      return data?.urls.filter((item) => item.longUrl.includes(searchTerm));
    }
    return data?.urls;
  }, [data?.urls, searchTerm]);

  /**
   * Handle search event.
   *
   * @param e - The event object.
   * @returns void
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex h-8 w-full items-center justify-between rounded-full bg-white px-4 hover:ring-2 hover:ring-indigo-500"
      >
        {selectedItems.length > 0 ? (
          <div className="flex items-center gap-2 overflow-hidden w-[90%]">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-md bg-slate-200 px-2 text-sm py-0.5"
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

      <div className="relative bg-slate-200">
        {open && (
          <div className="absolute top-2 z-20 w-full h-[300px] overflow-y-scroll bg-slate-100 no-scrollbar">
            <div className="relative mb-10">
              <input
                className="fixed left-4 right-4 rounded-full border border-slate-200 px-4 py-1 text-black outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="Search"
                onChange={handleSearch}
              />
            </div>
            {!isLoading &&
              filterDate?.map((item) => (
                <div
                  className=" flex cursor-pointer items-center rounded-md border border-slate-200 px-4 text-sm py-0.5 hover: hover:ring-2 hover:ring-indigo-500 mt-1"
                  key={item._id}
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
