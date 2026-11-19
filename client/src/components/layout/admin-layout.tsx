import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";
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

const LogoMark = () => (
  <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
    <svg
      width="14"
      height="18"
      viewBox="0 0 200 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

const AdminLayout = () => {
  const { pathname } = useLocation();
  const user = useAppSelector(selectCurrentUser) as AuthState;
  const { data } = useRetrieveSubscriptionQuery(
    { username: user.user.username },
    {
      skip: !user.user.username,
    }
  );
  const plan = data?.subscription?.data[0]?.plan.metadata.name ?? "free";

  const mainLinks = SIDEBAR_LINKS.filter((link) => !link.children);
  const accountLinks = SIDEBAR_LINKS.filter((link) => link.children);
  const isSettingsRoute = pathname.includes("setting");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        {/* Logo / wordmark */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <LogoMark />
            <span className="text-[15px] font-bold tracking-tight text-sidebar-foreground">
              SNEEK
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            General
          </p>
          <ul className="flex flex-col gap-1">
            {mainLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.slug}
                  className={({ isActive }) =>
                    classNames(
                      "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                      )}
                      <link.icon
                        size={18}
                        className={classNames(
                          "shrink-0 transition-colors",
                          isActive
                            ? "text-sidebar-primary"
                            : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                        )}
                      />
                      <span>{link.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Account
          </p>
          <ul className="flex flex-col gap-1">
            {accountLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.slug}
                  className={({ isActive }) =>
                    classNames(
                      "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive || isSettingsRoute
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {(isActive || isSettingsRoute) && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                      )}
                      <link.icon
                        size={18}
                        className={classNames(
                          "shrink-0 transition-colors",
                          isActive || isSettingsRoute
                            ? "text-sidebar-primary"
                            : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                        )}
                      />
                      <span>{link.name}</span>
                    </>
                  )}
                </NavLink>

                {isSettingsRoute && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                    {link.children?.map((sub_link, i) => (
                      <li key={i}>
                        <NavLink
                          className={({ isActive }) =>
                            classNames(
                              "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                              isActive
                                ? "font-medium text-sidebar-primary"
                                : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                            )
                          }
                          to={sub_link.slug}
                        >
                          <sub_link.icon size={15} />
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

        {/* Bottom: usage + user */}
        <div className="shrink-0 space-y-4 border-t border-sidebar-border p-4">
          <LinkLimitsDisplay />
          <div className="flex items-center gap-3 px-1">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-sm font-semibold text-sidebar-primary">
              {user.user.username?.[0]?.toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.user.username}
              </p>
              <p className="truncate text-xs capitalize text-sidebar-foreground/60">
                {plan} plan
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header isActive={true} plan={plan} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-8 lg:px-8">
          <DashboardTopInterface pathname={pathname} />

          {/* Mobile settings sub-nav (sidebar is hidden on small screens) */}
          {isSettingsRoute && (
            <div className="mb-4 flex gap-2 md:hidden">
              {accountLinks.flatMap((link) => link.children ?? []).map((sub_link) => (
                <NavLink
                  key={sub_link.slug}
                  to={sub_link.slug}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  <sub_link.icon size={14} />
                  {sub_link.name}
                </NavLink>
              ))}
            </div>
          )}

          <Outlet context={{ plan } as ContextType} />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-4">
          {SIDEBAR_LINKS.map((link) => (
            <li key={link.id}>
              <NavLink
                to={link.slug}
                className={({ isActive }) =>
                  classNames(
                    "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute -top-px left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-primary" />
                    )}
                    <link.icon size={20} />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export function useUserPlan() {
  return useOutletContext<ContextType>();
}

export default AdminLayout;
