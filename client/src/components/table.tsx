import React from "react";
import {
  IoTrashBinOutline,
  IoHeartOutline,
  IoHeartSharp,
  IoArrowRedoOutline,
} from "react-icons/io5";
import {
  useDeleteUrlMutation,
  useFavoriteUrlMutation,
  useVisitUrlMutation,
} from "../features/api";

import { Site } from "../types/types";

const Table = ({
  data,
  setIsModalOpen,
  setModalData,
}: {
  data: any;
  setIsModalOpen: any;
  setModalData: any;
}) => {
  const [favoriteShort] = useFavoriteUrlMutation();
  const [deleteUser] = useDeleteUrlMutation();
  const [visitUrl] = useVisitUrlMutation();

  const deletefn = async (short: string) => {
    deleteUser(short);
  };

  const favoritefn = async (short: string) => {
    favoriteShort(short);
  };

  const visitUrlfn = async (short: string) => {
    visitUrl(short);
  };

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-b">
          <th className="w-8 text-left">Full</th>
          <th className="w-8 text-left">Short</th>
          <th className="w-4 text-left">Visits</th>
          <th className="w-4"></th>
          <th className="w-4"></th>
          <th className="w-4"></th>
        </tr>
      </thead>

      <tbody>
        {data?.slice(0, 6).map((site: Site) => {
          return (
            <tr
              key={site.short}
              className="overflow-hidden h-8 border-b hover:bg-blue-500"
            >
              <td
                className="w-8 truncate overflow-hidden"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalData(site);
                }}
              >
                {site.full}
              </td>
              <td
                className="w-8 truncate overflow-hidden"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalData(site);
                }}
              >
                {site.short}
              </td>
              <td className="w-2 px-2">{site.clicks}</td>
              <td className="w-2">
                <button
                  className="w-full h-full flex items-center justify-center"
                  onClick={() => deletefn(site.short)}
                >
                  <IoTrashBinOutline />
                </button>
              </td>
              <td className="w-2">
                <button
                  className="w-full h-full flex items-center justify-center"
                  onClick={() => favoritefn(site.short)}
                >
                  {site.favorite ? <IoHeartSharp /> : <IoHeartOutline />}
                </button>
              </td>
              <td className="w-2">
                <a
                  className="w-full h-full flex items-center justify-center"
                  href={`http://localhost:4080/api/v1/short/${site.short}`}
                  target="_blank"
                  // data-original-title="null"
                  onClick={() => visitUrlfn(site.short)}
                >
                  <IoArrowRedoOutline />
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
