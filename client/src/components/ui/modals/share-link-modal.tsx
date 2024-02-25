import { useForm } from "react-hook-form";
import Input from "../Input";
import { Sheet, SheetContent } from "../sheet";
import { Dispatch, SetStateAction } from "react";
import { Url } from "../../../app/services/urlapi";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import Button from "../button";

type Props = {
  shareActive: boolean;
  setShareActive: Dispatch<SetStateAction<boolean>>;
  url: Url;
};

const ShareLinkModal = ({ shareActive, setShareActive, url }: Props) => {
  const { register, reset, handleSubmit } = useForm<{ email: "" }>();

  const handleShareLink = async () => {};

  return (
    <>
      {shareActive && (
        <>
          <Sheet triggerFn={setShareActive} />
          <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
            <div className="relative p-4 w-[500px]">
              <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-slate-200 p-4">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                    url.longUrl
                  )}`}
                  className="w-[30px]"
                  alt=""
                />
                <p>Sharing sneek.co/{url.short}</p>
              </div>

              <div className="pt-20">
                <h2 className="font-bold">
                  Share Link with friend on <span>Sneek</span>
                </h2>
                <form onSubmit={handleSubmit(handleShareLink)} className="mt-4">
                  <div className="">
                    <input
                      className="w-full rounded-full px-2 py-1"
                      {...register("email")}
                      placeholder="example@gmail.com"
                    />
                  </div>
                </form>

                <div className="my-4 border-t border-b border-slate-200 py-4 text-center">
                  Or
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button>Facebook</Button>
                  <Button>Twitter(X)</Button>
                  <Button>LinkedIn</Button>
                  <Button>Instagram</Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default ShareLinkModal;
