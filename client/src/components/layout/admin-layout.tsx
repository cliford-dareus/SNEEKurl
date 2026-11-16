import {
  NavLink,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthState, selectCurrentUser } from "../../features/auth/authslice";
import { useAppSelector } from "../../app/hook";
import { SIDEBAR_LINKS } from "../../Utils/common";
import Header from "../Header";
import DashboardTopInterface from "../dashboard-top-interface";
import LinkLimitsDisplay from "../link-limits-display";
import { useRetrieveSubscriptionQuery } from "../../app/services/stripe";
import classNames from "classnames";

type ContextType = {
  plan: string | null;
};

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sub_active, setSub_Active] = useState(0);
  const user = useAppSelector(selectCurrentUser) as AuthState;
  const { data } = useRetrieveSubscriptionQuery(
    { username: user.user.username },
    {
      skip: !user.user.username,
    }
  );
  const plan = data?.subscription?.data[0]?.plan.metadata.name ?? "free";

  useEffect(() => {
    SIDEBAR_LINKS.map((link, index) => {
      if (link.slug === pathname) {
        setActiveIndex(index);
      }
    });
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-background">
      <Header isActive={true} plan={plan} />
      <main className="mx-auto max-w-6xl overflow-hidden px-4 pt-16 sm:px-6">
        <DashboardTopInterface pathname={pathname} />
        <div className="flex h-[calc(100vh_-_180px)] flex-col-reverse gap-6 md:flex-row">
          <aside className="flex w-full flex-col gap-4 md:max-w-[220px]">
            <nav className="hidden md:block">
              <ul className="flex flex-col gap-0.5">
                {SIDEBAR_LINKS.map((link, index) => (
                  <li key={link.id} className="relative">
                    <NavLink
                      onClick={() => setActiveIndex(index)}
                      to={link.slug}
                      className={({ isActive }) =>
                        classNames(
                          "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )
                      }
                    >
                      <link.icon size={16} className="shrink-0" />
                      <span>{link.name}</span>
                    </NavLink>

                    {activeIndex === index && pathname.includes("setting") && (
                      <ul className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                        {link.children?.map((sub_link, i) => (
                          <li key={i}>
                            <NavLink
                              className={({ isActive }) =>
                                classNames(
                                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                                  isActive
                                    ? "font-medium text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                )
                              }
                              onClick={() => setSub_Active(i)}
                              to={sub_link.slug}
                            >
                              <sub_link.icon size={14} />
                              <span>{sub_link.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <LinkLimitsDisplay />
          </aside>

          <div className="min-w-0 flex-1 overflow-y-auto no-scrollbar">
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
