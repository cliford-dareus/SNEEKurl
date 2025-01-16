import { Dispatch, SetStateAction, useState } from "react";
import { Sheet, SheetContent } from "../sheet";
import { Url } from "../../../app/services/urlapi";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import { QRCodeSVG } from "qrcode.react";

const URLs = "http://localhost:4080";

const EditQrModal = ({
  url,
  editQrActive,
  setQrActive,
}: {
  url: Url;
  editQrActive: boolean;
  setQrActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const [props, setProps] = useState(url);

  return (
    <>
      {editQrActive && (
        <>
          <Sheet triggerFn={setQrActive} />
          <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
            <div className="relative h-full p-4">
              <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-slate-200 p-4">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                    url.longUrl
                  )}`}
                  className="w-[30px]"
                  alt=""
                />
                <p>Qr sneek.co/{url.short}</p>
              </div>
              <div className="px-4 pt-20 pb-4">
                <QRCodeSVG
                  id="qr-svg"
                  className="w-full"
                  size={200}
                  value={`${URLs}/${url.short}`}
                />
              </div>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default EditQrModal;
