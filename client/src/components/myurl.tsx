import { useState } from "react";
import { Sheet, SheetContent } from "./ui/sheet";
import Button from "./ui/button";
import { Url, useGetUrlsQuery } from "../app/services/urlapi";
import { Popover, PopoverContainer } from "./ui/popover";
import {
  LuChevronLeft,
  LuChevronRight,
  LuForward,
  LuLink2,
  LuMoreVertical,
  LuQrCode,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { getSiteUrl } from "../Utils/getSiteUrl";
import VisitLinkButton from "./visit-link-button";

type Props = {
  url: Url;
};

const UrlItem = ({ url }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex p-4 gap-8 shadow-md bg-slate-300 rounded-lg">
      <div>
        <img
          className="w-[30px] h-[30px] rounded-full"
          src={`http://www.google.com/s2/favicons?domain=${getSiteUrl(
            url.longUrl
          )}`}
          loading="lazy"
          alt="site favicon"
        />
      </div>

      <div className="flex flex-col gap-4 w-[60%]">
        <div className="text-left">
          <p className="text-blue-700 flex gap-2 items-center">
            <LuLink2 />
            sneek.co/{url.short}
          </p>
          <p className="truncate">{url.longUrl}</p>
        </div>

        <div className="flex gap-4 items-center">
          <VisitLinkButton url={url}>
            <LuForward size={22} />
          </VisitLinkButton>
          <div className="cursor-pointer">Visit</div>
          <div className="cursor-pointer">
            <LuQrCode size={22} />
          </div>
        </div>
      </div>

      <PopoverContainer classnames="ml-auto" triggerFn={setOpen}>
        <div className="cursor-pointer" onClick={() => setOpen(!open)}>
          <LuMoreVertical size={24} />
        </div>

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

const Myurl = () => {
  const Navigate = useNavigate();
  const { data, isLoading, isError, isSuccess } = useGetUrlsQuery("page=1");

  return (
    <>
      <Sheet triggerFn={() => Navigate("..")} />
      <SheetContent classnames="fixed top-0 right-0 bottom-0 w-[35%] bg-red-400 py-10">
        <div className="p-4">
          <h2>Your URLS</h2>

          {!data ? (
            <div className="">
              <h2>No Recent</h2>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex flex-col gap-2">
                {data &&
                  data.urls?.map((url) => <UrlItem key={url._id} url={url} />)}
              </div>

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
      </SheetContent>
    </>
  );
};

export default Myurl;
