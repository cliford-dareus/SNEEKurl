import { useWindowSize, Size } from "../hooks/windowSize";
import { Link, useNavigate } from "react-router-dom";
import { IoMoon, IoMoonOutline, IoPowerOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useEffect, useState } from "react";
import Button from "./ui/button";
import {
  AuthState,
  removeCredentials,
  selectCurrentUser,
} from "../features/auth/authslice";
import { LuMoon, LuSunDim, LuUserCircle2, LuMenu, LuX } from "react-icons/lu";
import { useLogoutUserMutation } from "../app/services/auth";
import useScroll from "../hooks/use-scroll";
import classNames from "classnames";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import LinkLimitsDisplay from "./link-limits-display";

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

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigationItems = !isActive ? [
    { name: "Your Urls", href: "/yoururl" },
    { name: "Product", href: "/product" },
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
  ] : [
    { name: "Product", href: "/product" },
  ];

  return (
    <>
      <header
        className={classNames(
          "fixed z-40 w-full text-base-content flex justify-between items-center transition-all",
          scrolled || isActive
            ? "border-b border-base-300 bg-base-100/75 backdrop-blur-lg"
            : "",
        )}
      >
        <div className="container mx-auto flex h-14 w-full items-center px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 200 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                fill="currentColor"
              />
            </svg>
            <Link className="text-xl font-bold" to="/" onClick={closeMobileMenu}>
              SNEEK
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex mr-auto ml-16">
            <ul className="flex h-full items-center gap-2">
              {navigationItems.map((item) => (
                <li key={item.name} className="flex items-center justify-center hover:border-b">
                  <Link className="px-4 py-2" to={item.href}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div
              className="cursor-pointer p-2 rounded-lg hover:bg-base-200 transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <LuMoon size={24} /> : <LuSunDim size={24} />}
            </div>

            {!isAuthenticated ? (
              <>
                <Button classnames="bg-primary">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button classnames="bg-secondary">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            ) : (
              <>
                <Button classnames="bg-primary">
                  <Link to="/links" className="w-full flex items-center gap-2">
                    <LuUserCircle2 size={24} />
                    <p>{user.username}</p>
                  </Link>
                </Button>
                <Button classnames="bg-secondary" onClick={logout}>
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <div
              className="cursor-pointer p-2 rounded-lg hover:bg-base-200 transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <LuMoon size={20} /> : <LuSunDim size={20} />}
            </div>

            <button
              className="p-2 rounded-lg hover:bg-base-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={classNames(
          "fixed top-14 left-0 right-0 bg-base-100 border-b border-base-300 z-30 md:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Mobile Navigation */}
          <nav className="mb-6">
            <ul className="space-y-4">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    className="block py-2 text-lg hover:text-primary transition-colors"
                    to={item.href}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Auth Actions */}
          <div className="space-y-3">
            {!isAuthenticated ? (
              <>
                <Button classnames="w-full bg-primary justify-center">
                  <Link to="/login" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                </Button>
                <Button classnames="w-full bg-secondary justify-center">
                  <Link to="/register" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button classnames="w-full bg-primary justify-center">
                  <Link
                    to="/links"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={closeMobileMenu}
                  >
                    <LuUserCircle2 size={20} />
                    <span>{user.username}</span>
                  </Link>
                </Button>
                <Button
                  classnames="w-full bg-secondary justify-center"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile User Info */}
          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-base-300">
              <div className="flex items-center gap-3 text-sm text-base-content/70">
                <LuUserCircle2 size={16} />
                <span>Logged in as {user.username}</span>
              </div>
              {plan && (
                <div className="mt-2 text-sm text-primary">
                  Current plan: {plan}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
