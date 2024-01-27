import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import Qrform from "./qrform";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import Button from "../../components/ui/button";
import { downlaodSvg } from "../../Utils/downloadQr";
import classNames from "classnames";

type Props = {};

const QrResult = () => {
  const { qr } = useAppSelector((state: RootState) => state.qr);

  const imageSetting = {
    src: qr.logoSrc ?? "",
    x: undefined,
    y: undefined,
    height: qr.size / 6,
    width: qr.size / 6,
    excavate: true,
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mt-6 mb-4 gap-2">
        <div
          className={classNames(
            `w-[250px] h-[250px] scale-[.80] -translate-y-6 -translate-x-7`
          )}
        >
          <QRCodeCanvas
            className="absolute "
            id="qr-canvas"
            value={qr.url}
            size={qr.size}
            imageSettings={{ ...imageSetting }}
          />
          <QRCodeSVG
            className="absolute -z-10"
            id="qr-svg"
            value={qr.url}
            size={qr.size}
            imageSettings={{ ...imageSetting }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button>
            <a href="" onClick={(event) => downlaodSvg("qr-svg", event, "svg")}>
              Download SVG
            </a>
          </Button>
          <Button>
            {" "}
            <a
              href=""
              onClick={(event) => downlaodSvg("qr-canvas", event, "png")}
            >
              Download PNG
            </a>
          </Button>
        </div>
      </div>

      <Button>Generate another</Button>
      <p className="mt-2">Lorem ipsum dolor sit.</p>
    </div>
  );
};

const QrManager = (props: Props) => {
  const { isLoading, isSuccess } = useAppSelector(
    (state: RootState) => state.qr
  );

  return <div>{!isSuccess ? <Qrform /> : <QrResult />}</div>;
};

export default QrManager;
