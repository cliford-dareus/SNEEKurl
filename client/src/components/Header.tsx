import { useWindowSize, Size } from "../Utils/windowSize";
import { Link } from "react-router-dom";
import { IoMoon, IoMoonOutline, IoPowerOutline } from "react-icons/io5";
import { deleteUser, UserInterface } from "../features/userSlice";
import { useLogoutUserMutation } from "../features/api";
import { useAppDispatch } from "../app/hook";
import { useState } from "react";
import Popup from "./popup";

const Header = ({ user }: { user: UserInterface }) => {
  const size: Size = useWindowSize();
  const isMobile = size.width! < 768;
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string>("");
  const [pop, setPop] = useState(false)

  const [logginout] = useLogoutUserMutation();

  const logout = async () => {
    try {
      const data = await logginout({}).unwrap();
      dispatch(deleteUser());
      setMessage(data?.msg);
      setPop(true)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="w-full text-white p-4 flex justify-between items-center border-b sm:px-12">
      <Link to="/" className="text-white text-xl lg:text-5xl font-bold">
        SNEEK<i className="text-blue-600">URL</i>
      </Link>

      <nav
        className={`${
          isMobile
            ? "w-1/2 absolute h-1 hover:h-auto overflow-hidden right-1/2 translate-x-1/2 top-20 z-10"
            : ""
        }`}
      >
        <ul
          className={`${
            isMobile
              ? "flex flex-col gap-4 justify-center items-center bg-blue-800 p-4"
              : "md:flex md:gap-4"
          }`}
        >
          <li className="text-xl uppercase">
            <Link to="/recent">Recent</Link>
          </li>
          <li className="text-xl uppercase">
            <Link to="/favorite">Favorite</Link>
          </li>
          <li className="text-xl uppercase md:hidden">
            <button className="text-red-600" onClick={logout}>
              <IoPowerOutline />
            </button>
          </li>
        </ul>
      </nav>

      <div className="flex gap-4 items-center lg:w-60 lg:justify-end">
        <div className="flex items-center mr-2">
          <span className="hidden">
            <IoMoon />
          </span>
          <span className="">
            <IoMoonOutline />
          </span>
        </div>
        <p className="text-sm lg:text-lg">
          Welcome,
          {user ? (
            <span className="font-bold ml-2">{user.name}</span>
          ) : (
            <span className="text-white">Guest</span>
          )}
        </p>
        <span className="rounded-full bg-white w-10 h-10 inline-block"></span>
      </div>
      <Popup msg={message} pop={pop} setPop={setPop}/>
      
    </header>
  );
};

export default Header;
