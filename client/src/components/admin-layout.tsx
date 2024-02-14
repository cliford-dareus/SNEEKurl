import React from "react";
import Header from "./Header";
import { Link, Outlet } from "react-router-dom";

type Props = {};

const AdminLayout = (props: Props) => {
  return (
    <div className="relative h-screen">
      <Header isActive={true} />
      <main className="pt-16 container mx-auto overflow-hidden">
        <div className="h-[10vh]"></div>
        <div className="flex h-[80vh]">
          <div className="max-h-screen min-w-[296px] ">
            <nav>
              <ul className="">
                <li className="">
                  <Link to="/links">links</Link>
                </li>
                <li className="">
                  <Link to="account">Account</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="overflow-y-scroll flex-1">{<Outlet />}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
