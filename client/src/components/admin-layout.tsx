import Header from "./Header";
import {Link, NavLink, Outlet, useLocation} from "react-router-dom";
import Button from "./ui/button";
import {useState} from "react";
import classNames from "classnames";
import * as path from "path";
import DashboardTopInterface from "./dashboard-top-interface";

type Props = {};

const SIDEBAR_LINKS = [
    {
        id: 1,
        name: 'Overview',
        slug: '/links'
    },
    {
        id: 2,
        name: 'Favorite',
        slug: '/favorite'
    },
    {
        id: 3,
        name: 'Setting',
        slug: '/setting',
        children: [
            {
                name: 'Profile',
                slug: '/setting',
            },
            {
                name: 'Subscription',
                slug: 'setting/subscription',
            }
        ]
    }
]

const AdminLayout = (props: Props) => {
    const {pathname} = useLocation()
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [sub_active, setSub_Active] = useState(0);

    console.log(pathname)

    return (
        <div className="relative">
            <Header isActive={true}/>
            <main className="pt-16 container mx-auto overflow-hidden px-4">
                <DashboardTopInterface/>
                <div className="flex h-[80vh] pt-4 gap-4">
                    <div className="max-h-screen max-w-[256px] w-full">
                        <nav className='w-full'>
                            <ul className="w-full flex flex-col gap-1">
                                {
                                    SIDEBAR_LINKS.map((link, index) => (
                                        <li className='w-full flex items-center justify-center relative'>
                                            <NavLink
                                                onClick={() => setActiveIndex(index)}
                                                className="w-full py-2 px-4 hover:bg-slate-200 bg-slate-100 rounded-md"
                                                to={link.slug}
                                            >
                                                {link.name}
                                            </NavLink>

                                            {activeIndex === index &&
                                                <div className='absolute h-full w-[2px] bg-red-500 left-0'/>}

                                            {activeIndex === index && pathname.includes('setting') && (
                                                <div
                                                    className='absolute flex flex-col gap-1 rounded-lg p-2 bg-slate-100 right-0 left-8 top-12'>
                                                    {link.children?.map((sub_link, i) => (
                                                        <li className='w-full flex items-center relative'>
                                                            <NavLink
                                                                className="w-full py-2 px-4 hover:bg-slate-200 bg-slate-100 rounded-md"
                                                                onClick={() => setSub_Active(i)}
                                                                to={sub_link.slug}
                                                            >
                                                                {sub_link.name}
                                                            </NavLink>

                                                            {sub_active === i &&
                                                                <div
                                                                    className='absolute h-full w-[2px] bg-red-500 left-0'/>}
                                                        </li>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        </nav>
                    </div>
                    <div className="overflow-y-scroll no-scrollbar flex-1">{<Outlet/>}</div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
