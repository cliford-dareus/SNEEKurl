import { useState } from "react";
import Sheet from "./ui/sheet";
import Button from "./ui/button";
import { useGetUrlsQuery } from "../app/services/urlapi";
import { Popover, PopoverContainer } from "./ui/popover";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type Props = {};

const UrlItem = ({}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex p-4 gap-8 shadow-md">
      <div>
        <img className="w-[50px] h-[50px] rounded-full" src="" alt="" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-left">
          <p>https://www.sneek/TeY73NOP</p>
          <p>https://codepen.io/mudrenok/pen/NbbJmz?editors=1100</p>
        </div>

        <div className="flex gap-4">
          <Button>Visit</Button>
          <Button>Visit</Button>
          <Button>QR</Button>
        </div>
      </div>

      <PopoverContainer classnames="ml-auto" triggerFn={setOpen}>
        <Button onClick={() => setOpen(!open)}>edit</Button>

        {open && (
          <Popover classnames="right-0 top-6 flex flex-col gap-2 z-50">
            <div className="p-2 shadow-md">Edit</div>
            <div className="p-2 shadow-md">Save</div>
            <div className="p-2 shadow-md">Delete</div>
          </Popover>
        )}
      </PopoverContainer>
    </div>
  );
};

const Myurl = (props: Props) => {
  const { data, isLoading, isError } = useGetUrlsQuery();

  console.log(data);

  return (
    <Sheet classnames="fixed top-0 right-0 bottom-0 w-[40%] bg-red-400 py-20">
      <div className="p-4">
        <h2>Your URLS</h2>

        {data ? (
          <div className="">
            <h2>No Recent</h2>
          </div>
        ) : (
          <div className="">
            {[1, 2, 3].map((i) => (
              <UrlItem key={i} />
            ))}

            <div className="mt-4">
              <div className="flex gap-4 items-center justify-center">
                <Button classnames="px-8">
                  <LuChevronLeft size={24} />
                </Button>
                <Button classnames="px-8">1</Button>
                <Button classnames="px-8">
                  <LuChevronRight size={24} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
};

export default Myurl;
