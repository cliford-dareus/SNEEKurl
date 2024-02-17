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
};

const Header = ({ isActive }: Props) => {
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
        scrolled ? "border-b border-gray-200 bg-white/75 backdrop-blur-lg" : ""
      )}
    >
      <div className="container w-full mx-auto flex items-center px-4 h-14">
        <Link className="font-bold text-xl mr-16" to="/">
          SNEEK
        </Link>

        {!isActive ? (
          <nav className="mr-auto">
            <ul className="flex gap-2 h-full items-center">
              <li className="hover:border-b flex justify-center items-center">
                <Link className="px-4" to="/yoururl">
                  Your Urls
                </Link>
              </li>
              <li className="hover:border-b flex justify-center items-center">
                <Link className="px-4" to="">
                  Products
                </Link>
              </li>
              <li className="hover:border-b flex justify-center items-center">
                <Link className="px-4" to="/pricing">
                  Pricing
                </Link>
              </li>
              <li className="hover:border-b flex justify-center items-center">
                <Link className="px-4" to="">
                  Docs
                </Link>
              </li>
            </ul>
          </nav>
        ) : (
          <nav className="mr-auto">
            <ul className="flex gap-4 h-full items-center">
              <li className="hover:border-b flex justify-center items-center w-28">
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
