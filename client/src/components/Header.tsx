import { useWindowSize } from "../hooks/windowSize";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hook";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { removeCredentials } from "../features/auth/authslice";
import { LuMoon, LuSunDim, LuUserCircle2, LuMenu, LuX } from "react-icons/lu";
import { useLogoutUserMutation } from "../app/services/auth";
import useScroll from "../hooks/use-scroll";
import classNames from "classnames";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  isActive: boolean;
  plan?: string;
};

const Header = ({ isActive, plan }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrolled = useScroll(80);
  const { theme, toggleTheme } = useTheme();
  const Navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const windowSize = useWindowSize();
  const isMobile = (windowSize.width || 0) < 768;

  const logout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(removeCredentials());
      Navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navigationItems = !isActive
    ? [
        { name: "Product", href: "#product" },
        { name: "Pricing", href: "/pricing" },
        { name: "Docs", href: "/docs" },
      ]
    : [
        { name: "Product", href: "/product" },
        { name: "Help", href: "/help" },
      ];

  return (
    <>
      <header
        className={classNames(
          "fixed z-40 w-full transition-all duration-200",
          scrolled || isActive
            ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
            : "bg-background/0"
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 200 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-[15px] font-semibold tracking-tight">
              SNEEK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="ml-10 hidden md:flex">
            <ul className="flex items-center gap-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <LuMoon size={18} /> : <LuSunDim size={18} />}
            </button>

            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Get started</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/links" className="flex items-center gap-1.5">
                    <LuUserCircle2 size={16} />
                    <span>{user.username}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="ml-auto flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <LuMoon size={18} /> : <LuSunDim size={18} />}
            </button>

            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={classNames(
          "fixed left-0 right-0 top-14 z-30 border-b border-border bg-background transition-all duration-200 ease-out md:hidden",
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="px-4 py-5">
          <nav className="mb-5">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={closeMobileMenu}
                    className="block rounded-md px-3 py-2.5 text-[15px] text-foreground transition-colors hover:bg-muted"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" className="w-full justify-center" asChild>
                  <Link to="/login" onClick={closeMobileMenu}>
                    Sign in
                  </Link>
                </Button>
                <Button className="w-full justify-center" asChild>
                  <Link to="/register" onClick={closeMobileMenu}>
                    Get started
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full justify-center" asChild>
                  <Link
                    to="/links"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2"
                  >
                    <LuUserCircle2 size={16} />
                    <span>{user.username}</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={logout}
                >
                  Sign out
                </Button>
              </>
            )}
          </div>

          {isAuthenticated && plan && (
            <div className="mt-4 border-t border-border pt-4 text-center text-xs text-muted-foreground">
              Current plan: <span className="font-medium text-primary">{plan}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
