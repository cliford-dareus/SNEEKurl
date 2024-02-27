import { useWindowSize, Size } from "../Utils/hooks/windowSize";
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
import { LuMoon, LuSunDim, LuUserCircle2 } from "react-icons/lu";
import { useLogoutUserMutation } from "../app/services/auth";
import useLocalStorage from "../Utils/hooks/use-local-storage";
import useScroll from "../Utils/hooks/use-scroll";
import classNames from "classnames";

type Props = {
  isActive: boolean;
  plan?: string;
};

const Header = ({ isActive, plan }: Props) => {
  const scrolled = useScroll(80);
  const [value, setValue] = useLocalStorage("darkmode", "light");
  const Navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser) as AuthState;
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = value === "dark";
    if (initialColorValue) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [value]);

  const logout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(removeCredentials());
      // setMessage(data?.msg);
      Navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue(value);
  }, [darkMode]);

  return (
    <header
      className={classNames(
        "fixed z-40 w-full text-black dark:text-white flex justify-between items-center transition-all ",
        scrolled || isActive ? "border-b border-gray-200 bg-white/75 backdrop-blur-lg" : ""
      )}
    >
      <div className="container mx-auto flex h-14 w-full items-center px-4">
        <div className="flex items-center gap-2">
          <svg width="40"
               height="40"
               viewBox="0 0 200 250"
               fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                  fill="black"/>
          </svg>
          <Link className="mr-16 text-xl font-bold"
                to="/">SNEEK
          </Link>
        </div>


        {!isActive ? (
            <nav className="mr-auto">
              <ul className="flex h-full items-center gap-2">
              <li className="flex items-center justify-center hover:border-b">
                <Link className="px-4" to="/yoururl">
                  Your Urls
                </Link>
              </li>
              <li className="flex items-center justify-center hover:border-b">
                <Link className="px-4" to="">
                  Products
                </Link>
              </li>
              <li className="flex items-center justify-center hover:border-b">
                <Link className="px-4" to="/pricing">
                  Pricing
                </Link>
              </li>
              <li className="flex items-center justify-center hover:border-b">
                <Link className="px-4" to="">
                  Docs
                </Link>
              </li>
            </ul>
          </nav>
        ) : (
          <nav className="mr-auto">
            <ul className="flex h-full items-center gap-4">
              <li className="flex w-28 items-center justify-center hover:border-b">
                <Link className="px-4" to="">
                  Products
                </Link>
              </li>
            </ul>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <div
            className="mr-4 cursor-pointer"
            onClick={() => setDarkMode(!darkMode)}
          >
            {!darkMode ? <LuMoon size={24} /> : <LuSunDim size={24} />}
          </div>

          {!user.token ? (
            <Button>
              <Link to="/login">Sign In</Link>{" "}
            </Button>
          ) : (
            <Button className="flex items-center gap-2">
              <Link to="/links" className="flex items-center gap-2">
                <LuUserCircle2 size={24} />
                <p>{user.user.username}</p>
              </Link>
            </Button>
          )}

          {user.token ? (
            <Button onClick={logout}>Sign Out</Button>
          ) : (
            <Button>Sign Up</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
