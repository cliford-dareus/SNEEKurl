import { useState, useEffect } from "react";
import {
  IoTrashBinOutline,
  IoHeartOutline,
  IoHeartSharp,
  IoClose,
} from "react-icons/io5";
import { Site } from "../types/types";
import { getSiteUrl } from "../Utils/getSiteUrl";
import { QRCodeSVG } from "qrcode.react";
import { useDeleteUrlMutation, useFavoriteUrlMutation } from "../features/api";

const UrlModal = (props: { data: Site | undefined; close: any }) => {
  const [site, setSite] = useState<string>();

  const [favoriteShort] = useFavoriteUrlMutation();
  const [deleteUser] = useDeleteUrlMutation();

  useEffect(() => {
    const Site = getSiteUrl(props.data?.full);
    setSite(Site);
  }, [props.data]);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10/12 h-2/5 bg-blue-800 rounded-md shadow-md p-4 lg:translate-x-1/2 lg:w-1/2 lg:right-0 lg:h-4/6 ">
      <div className="h-full">
        <div className="flex flex-col gap-2">
          <img
            src={`https://icons.duckduckgo.com/ip2/${site}.ico`}
            alt=""
            loading="lazy"
            width="40px"
          />
          <a
            href={`http://localhost:4080/api/v1/short/${props.data?.short}`}
            target="_blank"
          >
            {`sneekurl.com/${props.data?.short}`}
          </a>
        </div>

        <div
          className="w-full h-1/2 mt-2 flex flex-col
        justify-between"
        >
          <p className="break-all">
            <span className="font-bold">Full Site</span>: {props.data?.full}
          </p>
          <div className="flex items-center gap-4">
            <button
              className="text-xl"
              onClick={() => {
                favoriteShort(props.data?.short)
                props.close();
              }}
            >
              {props.data?.favorite ? <IoHeartSharp /> : <IoHeartOutline />}
            </button>
            <button className="border px-4 py-1 rounded-md">
              <span
                className="flex items-center gap-2"
                onClick={() => {
                  deleteUser(props.data?.short);
                  props.close();
                }}
              >
                <IoTrashBinOutline />
                Clear
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-4">
          <button className="bg-white text-blue-800 py-2 px-3 rounded-md font-bold">
            Go to Website
          </button>
        </div>

        <div className="absolute bottom-5 right-4">
          <QRCodeSVG
            size={100}
            value={`https://sneekurl/${props.data?.short}/`}
          />
        </div>
        <span
          className="absolute top-4 right-4 text-3xl"
          onClick={() => props.close()}
        >
          <IoClose />
        </span>
      </div>
    </div>
  );
};

export default UrlModal;
