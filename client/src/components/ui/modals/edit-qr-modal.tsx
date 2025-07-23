import { Dispatch, SetStateAction, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../dialog";
import { Url } from "../../../app/services/urlapi";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import { QRCodeSVG } from "qrcode.react";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import Dialog from "../dialog";

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
  const Navigate = useNavigate();

  return (
    <>
      {editQrActive && (
        <>
          <Dialog open={editQrActive} onOpenChange={setQrActive}>
          <DialogContent>
               <DialogHeader>
                        <div className="flex items-center gap-3">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 200 250"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                              fill="currentColor"
                            />
                          </svg>
                          <div>
                            <DialogTitle>Create New Link</DialogTitle>
                            <DialogDescription>Shorten your URL and customize it</DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
            <div className="">
              <div className="px-4 pb-4">
                <QRCodeSVG
                  id="qr-svg"
                  className="w-full"
                  size={200}
                  value={`${URLs}/${url.short}`}
                />
              </div>

              <div className="flex w-full flex-col items-center justify-center rounded-bl-lg rounded-br-lg p-4">
                <Button classnames="bg-primary" onClick={() => Navigate("/qr/customize")
                }>Customize</Button>
              </div>
            </div>
          </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default EditQrModal;
