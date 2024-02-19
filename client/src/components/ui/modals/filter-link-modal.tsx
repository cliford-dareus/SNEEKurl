import { Sheet, SheetContent } from "../sheet";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Option, Select } from "../select";
import { useSearchParams } from "react-router-dom";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const FilterLinkModal = ({ open, setOpen }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = useCallback(
    (newParams: { [key: string]: string }) => {
      Object.entries(newParams).forEach(([key, value]) => {
        searchParams.set(key, value);
      });

      setSearchParams(searchParams);
    },
    [searchParams]
  );

  return (
    <>
      {open && (
        <>
          <Sheet triggerFn={setOpen} />
          <SheetContent classnames="bg-red-600 top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
            <div className="w-[400px] h-full relative">
              <div className="w-full p-4 fixed top-0 left-0 right-0 bg-slate-200 rounded-tr-lg rounded-tl-lg flex flex-col justify-center items-center">
                <img
                  src={`http://www.google.com/s2/favicons?domain=${getSiteUrl(
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
                onChange={(e) => updateSearchParams({ sort: e.target.value })}
              >
                <Option>Sort by date</Option>
                <Option value="asc">Old to New</Option>
                <Option classnames="mt-2" value="desc">
                  New to Old
                </Option>
              </Select>

              <Select
                classnames="mt-2"
                onChange={(e) => updateSearchParams({ clicks: e.target.value })}
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
