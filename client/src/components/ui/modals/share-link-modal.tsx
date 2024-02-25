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
            <div className="p-4 w-[500px] relative">
              <div className="w-full p-4 fixed top-0 left-0 right-0 bg-slate-200 rounded-tr-lg rounded-tl-lg flex flex-col justify-center items-center">
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
                      className="w-full py-1 px-2 rounded-full"
                      {...register("email")}
                      placeholder="example@gmail.com"
                    />
                  </div>
                </form>

                <div className="border-t border-b py-4 my-4 border-slate-200 text-center">
                  Or
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
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
