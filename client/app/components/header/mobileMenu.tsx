import React from "react";
import { Link } from "@remix-run/react";
import { Menu, NONAUTHMenu } from "~/utils/menu";
import { ReactIcons } from "~/utils/reactIcons";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

export const MobileMenu: React.FC = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const { IoMdNotifications, MdOutlineKeyboardArrowDown } = ReactIcons;
    return (
        <div className="flex flex-col flex-wrap w-full gap-y-2.5 py-5">
            <nav className="flex flex-col flex-wrap py-1.5 px-2.5 rounded-xl text-white bg-section-title">
                <ul className="flex flex-col flex-wrap items-center gap-y-2.5">
                    {auth?.tokens && auth.user ? (
                        <>
                            {Menu?.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <Link
                                            className="rounded-full py-1.5 px-3.5 flex flex-row flex-wrap items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed]"
                                            to={item.path ? item.path : "#"}
                                        >
                                            {item.icon && item.icon}
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {NONAUTHMenu?.map((item) => {
                                return (
                                    <li key={item.id}>
                                        {item.name === "channels" ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Handle channel click
                                                }}
                                                className="rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed] cursor-pointer"
                                            >
                                                {item.icon && item.icon}
                                                {item.name}
                                            </button>
                                        ) : item.path?.startsWith("/#") ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (item.path) {
                                                        const element = document.getElementById(item.path.replace("/#", ""));
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: "smooth" });
                                                        }
                                                    }
                                                }}
                                                className="rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed] cursor-pointer"
                                            >
                                                {item.icon && item.icon}
                                                {item.name}
                                            </button>
                                        ) : (
                                            <Link
                                                to={item.path || "#"}
                                                className="rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed]"
                                            >
                                                {item.icon && item.icon}
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </>
                    )}
                </ul>
            </nav>
            {auth.tokens && auth.user ? (
                <div className="flex flex-row flex-wrap items-center justify-center">
                    <Link className="p-2.5" to={'/'}>
                        <IoMdNotifications className="text-2xl" />
                    </Link>
                    <div className="relative">
                        <button className="text-sm py-[0.688rem] px-[2.125rem] rounded-[1.875rem] uppercase text-white border border-purple bg-purple transition-all duration-[0.3s] flex items-center gap-2 leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-[#8c8888] focus:border-[#8c8888] xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito">
                            Rasel hossai ...
                            <MdOutlineKeyboardArrowDown />
                            <div className="bg-[#0000] border border-[#8c8888] rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block">
                                <Link
                                    className="text-section-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-purple py-0.5"
                                    to={'/'}
                                >
                                    Pay History
                                </Link>
                                <Link
                                    className="text-section-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-purple py-0.5"
                                    to={'/'}
                                >
                                    Support
                                </Link>
                                <Link
                                    className="text-section-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-purple py-0.5"
                                    to={'/'}
                                >
                                    Logout
                                </Link>
                            </div>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex lg:hidden flex-row flex-wrap justify-center items-center gap-x-4 text-base font-normal">
                    <Link className="py-3 px-10 border rounded-full uppercase text-black" to={'/login/'}>login</Link>
                    <Link className="py-3 px-10 border rounded-full uppercase text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed] " to={'/register/'}>sign up</Link>
                </div>
            )}
        </div>
    );
}