import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UrlResponse, useShortenUrlMutation } from "../../app/services/urlapi";
import Urlform from "./urlform";
import Button from "../../components/ui/button";
import Label from "../../components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import {
  LuLink,
  LuLink2,
  LuNavigation,
  LuQrCode,
  LuShare,
} from "react-icons/lu";
import { PopoverContainer, Popover } from "../../components/ui/popover";
import { downlaodSvg } from "../../Utils/downloadQr";
import { useAppSelector } from "../../app/hook";

type Props = {};
type IResultProps = {
  data: UrlResponse;
  setShowResult: Dispatch<SetStateAction<UrlResponse | undefined>>;
};

const URLs = "http://localhost:4080";

const QrButton = ({ data }: { data: UrlResponse }) => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverContainer triggerFn={setOpen}>
      <Button classnames="relative" onClick={() => setOpen(!open)}>
        <LuQrCode />
        Qr
        {open && (
          <Popover classnames="flex flex-col items-center justify-center">
            <QRCodeSVG
              id="qr-svg"
              className="w-full"
              value={`${URLs}/${data.short.short}`}
            />
            <Button classnames="mt-4 relative z-50 isolate">
              <a
                className=""
                onClick={(event) => downlaodSvg("qr-svg", event, "svg")}
              >
                Download Svg
              </a>
            </Button>
          </Popover>
        )}
      </Button>
    </PopoverContainer>
  );
};

const ShareButton = ({ data }: { data: UrlResponse }) => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverContainer triggerFn={setOpen}>
      <Button classnames="relative" onClick={() => setOpen(!open)}>
        <LuShare />
        Share
        {open && (
          <Popover classnames="flex flex-col items-center justify-center">
            <Button classnames="mt-4">Facebook</Button>
            <Button classnames="mt-4">Mail</Button>
            <Button classnames="mt-4">Twitter/X</Button>
          </Popover>
        )}
      </Button>
    </PopoverContainer>
  );
};

const UrlButtonGroup = ({ data }: { data: UrlResponse }) => {
  return (
    <>
      <Button>
        <LuNavigation />
        Visit
      </Button>

      <ShareButton data={data} />
      <QrButton data={data} />
    </>
  );
};

const UrlResult = ({ data, setShowResult }: IResultProps) => {
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <Label classnames="flex gap-4 items-center">
            <LuLink />
            Long Url
          </Label>
          <input
            readOnly
            className="w-full rounded-full text-black py-1 px-4 select-none"
            value={data?.short?.longUrl}
          />
        </div>

        <div className="flex flex-col items-start">
          <Label classnames="flex gap-4 items-center">
            <LuLink2 />
            Short Url
          </Label>
          <input
            readOnly
            className="w-full rounded-full text-black py-1 px-4 select-none"
            value={`${URLs}/${data?.short?.short}`}
          />
        </div>
      </div>

      <div className="flex gap-4 my-4">
        <UrlButtonGroup data={data} />
      </div>

      <Button onClick={() => setShowResult(undefined)}>shorten another</Button>
    </div>
  );
};

const UrlManager = (props: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const [showResult, setShowResult] = useState<UrlResponse | undefined>(
    undefined
  );
  const [atemptShorten, { data, isLoading, isSuccess }] =
    useShortenUrlMutation();

  useEffect(() => {
    setShowResult(data);
  }, [isSuccess]);

  if (isLoading) {
    return (
      <div className="">
        <span>Loading...</span>
      </div>
    );
  }

  if (data?.message) {
    return (
      <div className="flex flex-col mt-4 ">
        <p className="text-xl font-bold  text-red-500">{data.message}</p>
        <p className="my-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
          perspiciatis, totam molestiae labore saepe harum?
        </p>
        <Button classnames="mt-auto">Create your free account</Button>
      </div>
    );
  }

  return (
    <div>
      {!showResult ? (
        <Urlform shortenFn={atemptShorten} />
      ) : (
        <UrlResult data={showResult} setShowResult={setShowResult} />
      )}
    </div>
  );
};

export default UrlManager;
