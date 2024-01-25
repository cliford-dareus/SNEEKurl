import { useWindowSize, Size } from "../Utils/windowSize";
import { Link } from "react-router-dom";
import { IoMoon, IoMoonOutline, IoPowerOutline } from "react-icons/io5";
import { deleteUser } from "../features/userSlice";
import { useLogoutUserMutation } from "../features/api";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useState } from "react";
import { UserInterface } from "../types/types";
import { RootState } from "../app/store";
import Button from "./ui/button";

const Header = () => {
  const user = useAppSelector((state: RootState) => state.user);
  const size: Size = useWindowSize();
  const isMobile = size.width! < 768;
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string>("");
  const [pop, setPop] = useState(false);

  const [logginout] = useLogoutUserMutation();

  const logout = async () => {
    try {
      const data = await logginout({}).unwrap();
      dispatch(deleteUser());
      setMessage(data?.msg);
      setPop(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="fixed z-50 w-full text-white p-4 flex justify-between items-center sm:px-12">
      <div className="container mx-auto flex justify-between">
        <Link className="w-[84px]" to="/">
          SNEEK
        </Link>

        <nav className="">
          <ul className="flex gap-4 h-full w-full items-center">
            <li className="hover:border flex justify-center items-center">
              <Link className="px-4" to="/modal">
                Your Urls
              </Link>
            </li>
            <li className="hover:border flex justify-center items-center">
              <Link className="px-4" to="">
                Products
              </Link>
            </li>
            <li className="hover:border flex justify-center items-center">
              <Link className="px-4" to="">
                Docs
              </Link>
            </li>
          </ul>
        </nav>

        <div className="">
          <Button>Sign In</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
