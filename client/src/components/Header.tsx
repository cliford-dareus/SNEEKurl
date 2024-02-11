import { useWindowSize, Size } from "../Utils/hooks/windowSize";
import { Link } from "react-router-dom";
import { IoMoon, IoMoonOutline, IoPowerOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useEffect, useState } from "react";
import { RootState } from "../app/store";
import Button from "./ui/button";
import { AuthState, selectCurrentUser } from "../features/auth/authslice";
import { LuMoon, LuSunDim, LuUserCircle2 } from "react-icons/lu";

const Header = () => {
  const user = useAppSelector(selectCurrentUser) as AuthState;
  const size: Size = useWindowSize();
  const isMobile = size.width! < 768;
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string>("");
  const [pop, setPop] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // const [logginout] = useLogoutUserMutation();

  const logout = async () => {
    // try {
    //   const data = await logginout({}).unwrap();
    //   dispatch(deleteUser());
    //   setMessage(data?.msg);
    //   setPop(true);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  console.log(user);

  return (
    <header className="fixed z-40 w-full text-black dark:text-white p-4 flex justify-between items-center sm:px-12">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="w-[285px] font-bold text-xl" to="/">
          SNEEK
        </Link>

        <nav className="">
          <ul className="flex gap-4 h-full items-center">
            <li className="hover:border-b flex justify-center items-center w-28">
              <Link className="px-4" to="/yoururl">
                Your Urls
              </Link>
            </li>
            <li className="hover:border-b flex justify-center items-center w-28">
              <Link className="px-4" to="">
                Products
              </Link>
            </li>
            <li className="hover:border-b flex justify-center items-center w-28">
              <Link className="px-4" to="">
                Docs
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <div className="mr-4 cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
            {!darkMode ? <LuMoon size={24} /> : <LuSunDim  size={24}/>}
          </div>

          {!user.user.username ? (
            <Button>
              <Link to="/login">Sign In</Link>{" "}
            </Button>
          ) : (
            <Button className="flex items-center gap-2">
              <LuUserCircle2 size={24} />
              <p>{user.user.username}</p>
            </Button>
          )}

          <Button>
            <a href="http://localhost:4080/logout">Sign Out</a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
