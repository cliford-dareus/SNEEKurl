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

    return (
        <div className="relative">
            <Header isActive={true}/>
            <main className="container mx-auto overflow-hidden px-4 pt-16">
                <DashboardTopInterface/>
                <div className="flex gap-4 pt-4 h-[80vh]">
                    <div className="max-h-screen w-full max-w-[256px]">
                        <nav className='w-full'>
                            <ul className="flex w-full flex-col gap-1">
                                {
                                    SIDEBAR_LINKS.map((link, index) => (
                                        <li className='relative flex w-full items-center justify-center'>
                                            <NavLink
                                                onClick={() => setActiveIndex(index)}
                                                className="w-full rounded-md bg-slate-100 px-4 py-2 hover:bg-slate-200"
                                                to={link.slug}
                                            >
                                                {link.name}
                                            </NavLink>

                                            {activeIndex === index &&
                                                <div className='absolute left-0 h-full bg-red-500 w-[2px]'/>}

                                            {activeIndex === index && pathname.includes('setting') && (
                                                <div
                                                    className='absolute top-12 right-0 left-8 flex flex-col gap-1 rounded-lg bg-slate-100 p-2'>
                                                    {link.children?.map((sub_link, i) => (
                                                        <li className='relative flex w-full items-center'>
                                                            <NavLink
                                                                className="w-full rounded-md bg-slate-100 px-4 py-2 hover:bg-slate-200"
                                                                onClick={() => setSub_Active(i)}
                                                                to={sub_link.slug}
                                                            >
                                                                {sub_link.name}
                                                            </NavLink>

                                                            {sub_active === i &&
                                                                <div
                                                                    className='absolute left-0 h-full bg-red-500 w-[2px]'/>}
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
                    <div className="flex-1 overflow-y-scroll no-scrollbar">{<Outlet/>}</div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
