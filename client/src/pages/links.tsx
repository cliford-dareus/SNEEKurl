import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { Url, useGetUrlsQuery } from "../app/services/urlapi";
import { Link, useSearchParams } from "react-router-dom";
import { LuLink2, LuMoreVertical } from "react-icons/lu";
import { getSiteUrl } from "../Utils/getSiteUrl";
import { Popover, PopoverContainer } from "../components/ui/popover";
import EditLinkModal from "../components/ui/modals/edit-link-modal";
import EditQrModal from "../components/ui/modals/edit-qr-modal";
import ShareLinkModal from "../components/ui/modals/share-link-modal";

const LinkCard = ({ url }: { url: Url }) => {
  const [open, setOpen] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [qrActive, setQrActive] = useState(false);
  const [shareActive, setShareActive] = useState(false);

  return (
    <>
      <div className="h-[100px] bg-slate-300 rounded-lg p-4 flex gap-4 items-center">
        <img
          className="w-[30px] h-[30px] rounded-full"
          src={`http://www.google.com/s2/favicons?domain=${getSiteUrl(
            url.longUrl
          )}`}
          loading="lazy"
          alt="site favicon"
        />

        <div className="w-[80%]">
          <div className="flex items-center gap-4">
            <Link
              className="text-blue-700 flex gap-2 items-center"
              to={`http://localhost:4080/${url.short}`}
            >
              <LuLink2 />
              sneek.co/{url.short}
            </Link>

            <div className="ml-24">stats(clicks, analytics ...)</div>
          </div>

          <p className="truncate">{url.longUrl}</p>
          <div>Buttons</div>
        </div>

        <PopoverContainer classnames="ml-auto" triggerFn={setOpen}>
          <div className="cursor-pointer" onClick={() => setOpen(!open)}>
            <LuMoreVertical size={24} />
          </div>

          {open && (
            <Popover classnames="right-0 top-6 flex flex-col gap-2 z-50">
              <div
                className="p-2 shadow-md"
                onClick={() => {
                  setQrActive(true);
                  setOpen(false);
                }}
              >
                Qr
              </div>

              <div
                className="p-2 shadow-md"
                onClick={() => {
                  setEditActive(true);
                  setOpen(false);
                }}
              >
                Edit
              </div>

              <div
                className="p-2 shadow-md"
                onClick={() => {
                  setShareActive(true);
                  setOpen(false);
                }}
              >
                Share
              </div>
              <div className="p-2 shadow-md">Delete</div>
            </Popover>
          )}
        </PopoverContainer>
      </div>

      <EditLinkModal
        url={url}
        editActive={editActive}
        setEditActive={setEditActive}
      />

      <EditQrModal
        url={url}
        setQrActive={setQrActive}
        editQrActive={qrActive}
      />

      <ShareLinkModal
        shareActive={shareActive}
        setShareActive={setShareActive}
        url={url}
      />
    </>
  );
};

const LinkItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState<string | null>("");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");

  const { data, isLoading } = useGetUrlsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const createQueryParams = (s: { [key: string]: string | null }) => {
      let str = [];
      for (const [key, value] of Object.entries(s)) {
        if (value === null) {
          continue;
        } else {
          str.push(`${key}=${value}`);
        }
      }
      setQueryParams(str.join("&"));
    };

    createQueryParams({ page, sort });
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4">
      {!isLoading && data?.urls.map((url) => <LinkCard url={url} />)}
    </div>
  );
};

const Favorite = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAppSelector((state: RootState) => state.auth);

  const updateSearchParams = useCallback(
    (newParams: { [key: string]: string }) => {
      Object.entries(newParams).forEach(([key, value]) => {
        searchParams.set(key, value);
      });

      setSearchParams(searchParams);
    },
    []
  );

  return (
    <>
      <section className="">
        {/* Create Filters for links */}
        <div>
          <button onClick={() => updateSearchParams({ sort: "1234" })}>
            set
          </button>
          <button onClick={() => updateSearchParams({ page: "2" })}>
            page
          </button>
        </div>

        <LinkItems />
      </section>
    </>
  );
};

export default Favorite;
