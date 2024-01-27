import { QRCodeCanvas } from "qrcode.react";
import Qrform from "./qrform";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import Button from "../../components/ui/button";

type Props = {};

const QrResult = () => {
  const { qr } = useAppSelector((state: RootState) => state.qr);

  const imageSetting = {
    src: qr.logoSrc ?? "",
    x: 0,
    y: 0,
    height: 24,
    width: 24,
    excavate: true,
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mt-6 mb-4 gap-2">
        <QRCodeCanvas
          value={qr.url}
          size={qr.size}
          imageSettings={{ ...imageSetting }}
        />
        <div className="flex flex-col gap-4">
          <Button>Downlaod SVG</Button>
          <Button>Downlaod PNG</Button>
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
