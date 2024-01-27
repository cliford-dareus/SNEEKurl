import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
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
import Popover from "../../components/ui/popover";

type Props = {};
type IResultProps = {
  data: UrlResponse;
  setShowResult: Dispatch<SetStateAction<UrlResponse | undefined>>;
};

const URLs = "http://localhost:4080";

const QrButton = ({ data }: { data: UrlResponse }) => {
  const [open, setOpen] = useState(false);
  const downLoadRef = useRef<HTMLAnchorElement | null>(null);

  const downloadQrCode = () => {
    const svgElement = document.querySelector("#qr-svg") as HTMLElement | null;
    const anchoElement = downLoadRef.current;

    if (!svgElement) throw new Error("<svg> not found in the DOM");

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    if (!anchoElement) throw new Error("<svg> not found in the DOM");
    anchoElement.href = svgUrl;
    anchoElement.download = "QR code.svg";
    anchoElement.click();
  };

  return (
    <Button
      classnames="relative"
      onClick={() => setOpen(!open)}
      onBlur={() => setOpen(false)}
    >
      <LuQrCode />
      Qr
      {open && (
        <Popover classnames="flex flex-col items-center justify-center">
          <QRCodeSVG
            id="qr-svg"
            className="w-full"
            value={`${URLs}/${data.short.short}`}
          />
          <Button classnames="mt-4" onClick={() => downloadQrCode}>
            <a href="" ref={downLoadRef} onClick={downloadQrCode}>
              Download Svg
            </a>
          </Button>
        </Popover>
      )}
    </Button>
  );
};

const ShareButton = ({ data }: { data: UrlResponse }) => {
  const [open, setOpen] = useState(false);

  return (
    <Button
      classnames="relative"
      onClick={() => setOpen(!open)}
      onBlur={() => setOpen(false)}
    >
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
            value={data?.short.longUrl}
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
            value={`${URLs}/${data?.short.short}`}
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
  const [showResult, setShowResult] = useState<UrlResponse | undefined>(
    undefined
  );
  const [atemptShorten, { data, isLoading, isSuccess }] =
    useShortenUrlMutation();

  useEffect(() => {
    setShowResult(data);
  }, [isSuccess]);

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
