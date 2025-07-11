import { Link } from "@remix-run/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "~/redux/features/auth/authSlice";
import { useGetLogoQuery } from "~/redux/features/configuration/configurationApi";
import { openChannel } from "~/redux/features/popup/popupSlice";
import { RootState } from "~/redux/store";
import { MEDIA_URL } from "~/utils/api";
import { Menu, NONAUTHMenu } from "~/utils/menu";
import { ReactIcons } from "~/utils/reactIcons";
import { MobileMenu } from "./mobileMenu";

export const Header = () => {
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false);
  const {
    IoMdNotifications,
    MdOutlineKeyboardArrowDown,
    RiMenu3Fill,
    IoCloseOutline,
  } = ReactIcons;
  const { data } = useGetLogoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const Logo = data?.data?.logo;
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleChannelClick = () => {
    dispatch(openChannel());
  };

  const handleSmoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderMenuItems = (menuList: typeof Menu) =>
    menuList.map((item) => (
      <li key={item.id}>
        {item.name === "channels" ? (
          <button
            type="button"
            onClick={handleChannelClick}
            className="rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed] cursor-pointer"
          >
            {item.icon && item.icon}
            {item.name}
          </button>
        ) : item.path?.startsWith("/#") ? (
          <button
            type="button"
            onClick={() =>
              item.path && handleSmoothScroll(item.path.replace("/#", ""))
            }
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
    ));

  return (
    <header className="relative top-0 left-0 right-0 py-5 w-full">
      <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          <Link className="block w-fit" to={"/"}>
            <img
              className="w-28 sm:w-28 md:w-32 lg:w-40"
              src={`${MEDIA_URL}${Logo}`}
              alt="bijolis"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <nav className="hidden lg:flex flex-col flex-wrap py-1.5 px-2.5 rounded-full text-white bg-section-title">
            <ul className="flex flex-row flex-wrap items-center gap-x-2.5">
              {auth?.tokens && auth.user
                ? renderMenuItems(Menu)
                : renderMenuItems(NONAUTHMenu)}
            </ul>
          </nav>
          {auth.tokens && auth.user ? (
            <div className="hidden lg:flex flex-row flex-wrap items-center">
              <Link className="p-2.5" to={"/"}>
                <IoMdNotifications className="text-2xl" />
              </Link>
              <div className="relative">
                <button className="py-[0.688rem] px-[2.125rem] pr-6 rounded-[1.875rem] uppercase text-white border border-purple bg-purple transition-all duration-[0.3s] flex items-center text-base leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-[#8c8888] focus:border-[#8c8888] xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito">
                  {auth?.user?.name}
                  <MdOutlineKeyboardArrowDown />
                  <div className="bg-[#0000] border border-[#8c8888] rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block">
                    <Link
                      className="text-section-title text-[0.688rem] uppercase block hover:text-purple py-0.5"
                      to={"/"}
                    >
                      Pay History
                    </Link>
                    <Link
                      className="text-section-title text-[0.688rem] uppercase block hover:text-purple py-0.5"
                      to={"/"}
                    >
                      Support
                    </Link>
                    <button
                      className="text-section-title text-[0.688rem] w-full uppercase block hover:text-purple py-0.5 cursor-pointer"
                      type="button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-row flex-wrap items-center gap-x-8 text-base font-normal">
              <Link
                className="py-3 px-10 border rounded-full uppercase text-black"
                to={"/login/"}
              >
                login
              </Link>
              <Link
                className="py-3 px-10 border rounded-full uppercase text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed]"
                to={"/register/"}
              >
                sign up
              </Link>
            </div>
          )}
          <button
            className="block lg:hidden"
            type="button"
            onClick={() => setIsMenuShow(!isMenuShow)}
          >
            {isMenuShow ? (
              <IoCloseOutline className="text-3xl sm:text-4xl" />
            ) : (
              <RiMenu3Fill className="text-2xl sm:text-3xl" />
            )}
          </button>
        </div>
        {isMenuShow && <MobileMenu />}
      </div>
    </header>
  );
};
