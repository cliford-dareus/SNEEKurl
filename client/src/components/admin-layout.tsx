import Header from "./Header";
import {
  NavLink,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardTopInterface from "./dashboard-top-interface";
import { useRetrieveSubscriptionQuery } from "../app/services/stripe";
import { SIDEBAR_LINKS } from "../Utils/common";

type ContextType = {
  plan: string | null;
};

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sub_active, setSub_Active] = useState(0);
  const { data } = useRetrieveSubscriptionQuery();
  // const plan = data?.subscription?.data[0].plan.metadata.name;
  const plan = "pro";

  useEffect(() => {
    SIDEBAR_LINKS.map((link, index) => {
      if (link.slug === pathname) {
        setActiveIndex(index);
      }
    });
  }, []);

  return (
    <div className="relative">
      <Header isActive={true} plan={plan} />
      <main className="container mx-auto overflow-hidden px-4 pt-16">
        <DashboardTopInterface pathname={pathname} />
        <div className="flex gap-4 pt-4 h-[80vh]">
          <div className="max-h-screen w-full max-w-[256px]">
            <nav className="w-full">
              <ul className="flex w-full flex-col gap-1">
                {SIDEBAR_LINKS.map((link, index) => (
                  <li className="relative flex w-full items-center justify-center">
                    <NavLink
                      onClick={() => setActiveIndex(index)}
                      className="w-full rounded-md bg-slate-100 px-4 py-2 hover:bg-slate-200"
                      to={link.slug}
                    >
                      {link.name}
                    </NavLink>

                    {activeIndex === index && (
                      <div className="absolute left-0 h-full bg-indigo-500 w-[2px]" />
                    )}

                    {activeIndex === index && pathname.includes("setting") && (
                      <div className="absolute top-12 right-0 left-8 flex flex-col gap-1 rounded-lg bg-slate-100 p-2">
                        {link.children?.map((sub_link, i) => (
                          <li className="relative flex w-full items-center">
                            <NavLink
                              className="w-full rounded-md bg-slate-100 px-4 py-2 hover:bg-slate-200"
                              onClick={() => setSub_Active(i)}
                              to={sub_link.slug}
                            >
                              {sub_link.name}
                            </NavLink>

                            {sub_active === i && (
                              <div className="absolute left-0 h-full bg-indigo-500 w-[2px]" />
                            )}
                          </li>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex-1 overflow-y-scroll no-scrollbar">
            <Outlet context={{ plan } as ContextType} />
          </div>
        </div>
      </main>
    </div>
  );
};

export function useUserPlan() {
  return useOutletContext<ContextType>();
}

export default AdminLayout;
