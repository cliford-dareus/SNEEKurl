import { ReactNode, useState } from "react";
import { LuForward } from "react-icons/lu";
import { Url } from "../app/services/urlapi";
import Portal from "./portal";
import VisitLinkPassword from "./ui/modals/visit-link-password";

type Props = {
  url: Url;
  children: ReactNode;
};

const VisitLinkButton = ({ url, children }: Props) => {
  const [active, setActive] = useState<{ status: boolean; url: Url | null }>({
    status: false,
    url: null,
  });

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={async () => {
          try {
            await fetch(`http://localhost:4080/short/${url.short}`).then(
              (res) => {
                if (res.status === 403) {
                  setActive({ status: true, url: url });
                }

                if (res.status === 200)
                  [window.open(`http://localhost:4080/short/${url.short}`)];
              }
            );
          } catch (error) {
            window.open(`http://localhost:4080/short/${url.short}`)
          }
        }}
      >
        {children}
      </div>

      <Portal>
        <VisitLinkPassword
          status={active.status}
          url={active.url!}
          setStatus={setActive}
        />
      </Portal>
    </>
  );
};

export default VisitLinkButton;
