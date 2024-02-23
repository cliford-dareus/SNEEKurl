import Header from "./Header";
import { Link, Outlet } from "react-router-dom";
import Button from "./ui/button";
import {useState} from "react";

type Props = {};

const AdminLayout = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Header isActive={true} />
      <main className="pt-16 container mx-auto overflow-hidden px-4">

        {/* Create a component for this */}
        <div className="h-[10vh] flex items-center">
          <div className='min-w-[296px]'>
            <Button>Add New Link</Button>
          </div>

          <div>
            <input />
          </div>
        </div>
        {/*      */}

        <div className="flex h-[80vh] pt-4">
          <div className="max-h-screen min-w-[296px]">
            <nav>
              <ul className="">

                <li className="">
                  <Link to="/links">links</Link>
                </li>

                <li className="">
                  <Link to="/links">Favorites</Link>
                </li>

                <li className="">
                  <Link to="/links">Stats</Link>
                </li>

                <li className="relative">
                  <Link onClick={() => setOpen((true))} to="setting">Settings</Link>

                  {open && (
                      <div className='absolute rounded-lg p-2 bg-slate-200 w-[200px] left-4'>
                        <Link to='.'>Profile</Link>
                      </div>

                  )}
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
