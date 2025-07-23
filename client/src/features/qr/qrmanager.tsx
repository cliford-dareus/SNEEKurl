import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import Qrform from "./qrform";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import Button from "../../components/ui/button";
import { downlaodSvg } from "../../Utils/downloadQr";
import classNames from "classnames";
import { removeQr } from "./qrslice";
import { LuDownload, LuRefreshCw, LuQrCode, LuImage, LuShare2 } from "react-icons/lu";
import { useState } from "react";

type Props = {};

const QrResult = () => {
  const dispatch = useAppDispatch();
  const { qr } = useAppSelector((state: RootState) => state.qr);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const imageSetting = {
    src: qr.logoSrc ?? "",
    x: undefined,
    y: undefined,
    height: qr.size / 6,
    width: qr.size / 6,
    excavate: true,
  };

  const handleDownload = async (type: 'svg' | 'png', elementId: string) => {
    setIsDownloading(type);
    try {
      await downlaodSvg(elementId, null, type);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary">
          <LuQrCode size={18} />
          <span className="font-medium">QR Code Generated</span>
        </div>
        <h2 className="text-2xl font-bold text-base-content">Your QR Code is Ready!</h2>
        <p className="text-base-content/70 text-sm">Download or share your custom QR code</p>
      </div>

      {/* QR Code Display */}
      <div className="bg-base-200 rounded-2xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* QR Code Container */}
          <div className="flex-shrink-0">
            <div className="relative bg-white p-6 rounded-xl shadow-lg">
              <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                <QRCodeCanvas
                  className="absolute inset-0"
                  id="qr-canvas"
                  value={qr.url}
                  size={qr.size}
                  imageSettings={{ ...imageSetting }}
                />
                <QRCodeSVG
                  className="absolute inset-0 -z-10"
                  id="qr-svg"
                  value={qr.url}
                  size={qr.size}
                  imageSettings={{ ...imageSetting }}
                />
              </div>
            </div>
          </div>

          {/* QR Code Info & Actions */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="space-y-6">
              {/* QR Code Details */}
              <div className="bg-base-100 rounded-lg p-4">
                <h3 className="font-semibold text-base-content mb-3">QR Code Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">URL:</span>
                    <span className="text-base-content font-mono text-xs truncate max-w-[200px]">
                      {qr.url}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Size:</span>
                    <span className="text-base-content">{qr.size}x{qr.size}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Logo:</span>
                    <span className="text-base-content">
                      {qr.logoSrc ? "✓ Included" : "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Actions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base-content">Download Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    classnames="bg-primary hover:bg-primary/90 text-primary-content justify-center"
                    onClick={() => handleDownload('svg', 'qr-svg')}
                    disabled={isDownloading === 'svg'}
                  >
                    {isDownloading === 'svg' ? (
                      <LuRefreshCw size={18} className="animate-spin" />
                    ) : (
                      <LuImage size={18} />
                    )}
                    <span>SVG Vector</span>
                  </Button>

                  <Button
                    classnames="bg-secondary hover:bg-secondary/90 text-secondary-content justify-center"
                    onClick={() => handleDownload('png', 'qr-canvas')}
                    disabled={isDownloading === 'png'}
                  >
                    {isDownloading === 'png' ? (
                      <LuRefreshCw size={18} className="animate-spin" />
                    ) : (
                      <LuDownload size={18} />
                    )}
                    <span>PNG Image</span>
                  </Button>
                </div>
              </div>

              {/* Share Action */}
              <Button
                classnames="w-full bg-accent hover:bg-accent/90 text-accent-content justify-center"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My QR Code',
                      text: 'Check out this QR code',
                      url: qr.url
                    });
                  }
                }}
              >
                <LuShare2 size={18} />
                <span>Share QR Code</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          classnames="bg-base-300 hover:bg-base-300/80 text-base-content justify-center"
          onClick={() => dispatch(removeQr())}
        >
          <LuRefreshCw size={18} />
          <span>Generate Another QR Code</span>
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-info/10 border border-info/20 rounded-lg p-4">
        <h4 className="font-medium text-info mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-info/80 space-y-1">
          <li>• SVG format is perfect for print materials and scalable designs</li>
          <li>• PNG format works best for web and digital applications</li>
          <li>• Test your QR code with different devices before using</li>
        </ul>
      </div>
    </div>
  );
};

const QrManager = (props: Props) => {
  const { isLoading, isSuccess } = useAppSelector(
    (state: RootState) => state.qr
  );

  return (
    <div className="min-h-[50vh]">
      <div className="container mx-auto px-4">
        {!isSuccess ? (
          <div className="">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary">
                <LuQrCode size={18} />
                <span className="font-medium">QR Code Generator</span>
              </div>
              <h1 className="text-3xl font-bold text-base-content">
                Create Custom QR Code
              </h1>
              <p className="text-base-content/70 text-sm">
                Generate a personalized QR code with your URL and custom logo
              </p>
            </div>
            <Qrform />
          </div>
        ) : (
          <QrResult />
        )}
      </div>
    </div>
  );
};

export default QrManager;
