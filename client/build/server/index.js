import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Link, Meta, Links, ScrollRestoration, Scripts, Outlet, useNavigate } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch, Provider } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { HiMiniHome as HiMiniHome$1 } from "react-icons/hi2";
import { IoMdEyeOff, IoMdNotifications } from "react-icons/io";
import { MdArrowRightAlt, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiMenu3Fill, RiFacebookCircleLine, RiTwitterXFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { IoEye, IoCloseOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa6";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const Notification = () => /* @__PURE__ */ jsx(ToastContainer, {});
const MEDIA_URL = "https://api.bjollys.net/";
const SERVER_URL = "https://api.bjollys.net/api/v1";
let initialState = {
  user: null,
  tokens: {
    access_token: null,
    refresh_token: null
  }
};
if (typeof window !== "undefined") {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    const parsed = JSON.parse(storedAuth);
    if (parsed && parsed.tokens) {
      initialState = parsed;
    }
  }
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.tokens.access_token = action.payload.tokens.access_token;
      state.tokens.refresh_token = action.payload.tokens.refresh_token;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.tokens.access_token = null;
      state.tokens.refresh_token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    }
  }
});
const { setAuth, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
const baseQuery = fetchBaseQuery({
  baseUrl: SERVER_URL,
  prepareHeaders: (headers, api) => {
    var _a, _b;
    const token = (_b = (_a = api.getState().auth) == null ? void 0 : _a.tokens) == null ? void 0 : _b.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});
const verifyAccessToken = async (accessToken, api, extraOptions) => {
  const result = await baseQuery(
    {
      url: "/token/verify/",
      method: "POST",
      body: { token: accessToken }
    },
    api,
    extraOptions
  );
  return !(result.error && result.error.status === 401);
};
const baseQueryWithReauth = async (args, api, extraOptions) => {
  var _a, _b;
  if (typeof args === "string") {
    args = { url: args };
  }
  const state = api.getState();
  let accessToken = state.auth.tokens.access_token;
  const refreshToken = state.auth.tokens.refresh_token;
  if (accessToken) {
    const isValid = await verifyAccessToken(accessToken, api, extraOptions);
    if (!isValid) {
      console.warn("Access token invalid. Will attempt refresh...");
      accessToken = void 0;
    }
  }
  let headers = {
    ...args.headers ?? {}
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  let result = await baseQuery({ ...args, headers }, api, extraOptions);
  if (((_a = result == null ? void 0 : result.error) == null ? void 0 : _a.status) === 401 && refreshToken) {
    console.warn("Access token expired. Trying to refresh...");
    const refreshResult = await baseQuery(
      {
        url: "/token/refresh/",
        method: "POST",
        body: { refresh: refreshToken }
      },
      api,
      extraOptions
    );
    const newAccessToken = (_b = refreshResult.data) == null ? void 0 : _b.access;
    if (newAccessToken) {
      accessToken = newAccessToken;
      api.dispatch(
        setAuth({
          user: state.auth.user,
          tokens: {
            access_token: newAccessToken,
            refresh_token: refreshToken
          }
        })
      );
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      result = await baseQuery({ ...args, headers }, api, extraOptions);
    } else {
      console.error("Refresh token expired or invalid. Logging out...");
      localStorage.removeItem("auth");
      api.dispatch(logout());
    }
  } else if (!refreshToken) {
    console.warn("No refresh token found. Logging out...");
    localStorage.removeItem("auth");
    api.dispatch(logout());
  }
  return result;
};
const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
const popupSlice = createSlice({
  name: "popup",
  initialState: {
    channel: false,
    seemore: false
  },
  reducers: {
    openChannel: (state) => {
      state.channel = true;
    },
    closeChannel: (state) => {
      state.channel = false;
    },
    openSeeMore: (state) => {
      state.seemore = true;
    },
    closeSeeMore: (state) => {
      state.seemore = false;
    }
  }
});
const {
  openChannel,
  closeChannel,
  openSeeMore,
  closeSeeMore
} = popupSlice.actions;
const popupSlice$1 = popupSlice.reducer;
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    popup: popupSlice$1
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production"
});
const Logo = "/assets/bijolis-DvYc4n3J.png";
const ReactIcons = {
  HiMiniHome: HiMiniHome$1,
  IoMdNotifications,
  MdOutlineKeyboardArrowDown,
  RiFacebookCircleLine,
  FaInstagram,
  RiTwitterXFill,
  CiLinkedin,
  IoEye,
  IoMdEyeOff,
  RiMenu3Fill,
  IoCloseOutline,
  MdArrowRightAlt,
  FaFacebook
};
const { HiMiniHome } = ReactIcons;
const NONAUTHMenu = [
  {
    id: 1,
    name: void 0,
    path: "/",
    icon: /* @__PURE__ */ jsx(HiMiniHome, { className: "text-lg" })
  },
  {
    id: 2,
    name: "channels",
    path: void 0,
    icon: void 0
  },
  {
    id: 3,
    name: "services",
    path: "/services/",
    icon: void 0
  },
  {
    id: 4,
    name: "about",
    path: "/about/",
    icon: void 0
  }
];
const Menu = [
  {
    id: 1,
    name: void 0,
    path: "/",
    icon: /* @__PURE__ */ jsx(HiMiniHome, { className: "text-lg" })
  },
  {
    id: 2,
    name: "channels",
    path: void 0,
    icon: void 0
  },
  {
    id: 3,
    name: "services",
    path: "/",
    icon: void 0
  },
  {
    id: 4,
    name: "about",
    path: "/",
    icon: void 0
  },
  {
    id: 5,
    name: "subscription",
    path: "/subscription/",
    icon: void 0
  },
  {
    id: 6,
    name: "dashboard",
    path: "/dashboard/",
    icon: void 0
  }
];
const MobileMenu = () => {
  const auth = useSelector((state) => state.auth);
  const { IoMdNotifications: IoMdNotifications2, MdOutlineKeyboardArrowDown: MdOutlineKeyboardArrowDown2 } = ReactIcons;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full gap-y-2.5 py-5", children: [
    /* @__PURE__ */ jsx("nav", { className: "flex flex-col flex-wrap py-1.5 px-2.5 rounded-xl text-white bg-section-title", children: /* @__PURE__ */ jsx("ul", { className: "flex flex-col flex-wrap items-center gap-y-2.5", children: Menu == null ? void 0 : Menu.map((item) => {
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          className: "rounded-full py-1.5 px-3.5 flex flex-row flex-wrap items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed]",
          to: item.path ? item.path : "#",
          children: [
            item.icon && item.icon,
            item.name
          ]
        }
      ) }, item.id);
    }) }) }),
    auth.tokens && auth.user ? /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center justify-center", children: [
      /* @__PURE__ */ jsx(Link, { className: "p-2.5", to: "/", children: /* @__PURE__ */ jsx(IoMdNotifications2, { className: "text-2xl" }) }),
      /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("button", { className: "text-sm py-[0.688rem] px-[2.125rem] rounded-[1.875rem] uppercase text-white border border-purple bg-purple transition-all duration-[0.3s] flex items-center gap-2 leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-[#8c8888] focus:border-[#8c8888] xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito", children: [
        "Rasel hossai ...",
        /* @__PURE__ */ jsx(MdOutlineKeyboardArrowDown2, {}),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#0000] border border-[#8c8888] rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              className: "text-section-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-purple py-0.5",
              to: "/",
              children: "Pay History"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              className: "text-section-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-purple py-0.5",
              to: "/",
              children: "Support"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              className: "text-section-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-purple py-0.5",
              to: "/",
              children: "Logout"
            }
          )
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 flex lg:hidden flex-row flex-wrap justify-center items-center gap-x-4 text-base font-normal", children: [
      /* @__PURE__ */ jsx(Link, { className: "py-3 px-10 border rounded-full uppercase text-black", to: "/login/", children: "login" }),
      /* @__PURE__ */ jsx(Link, { className: "py-3 px-10 border rounded-full uppercase text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed] ", to: "/register/", children: "sign up" })
    ] })
  ] });
};
const Header = () => {
  var _a;
  const [isMenuShow, setIsMenuShow] = useState(false);
  const { IoMdNotifications: IoMdNotifications2, MdOutlineKeyboardArrowDown: MdOutlineKeyboardArrowDown2, RiMenu3Fill: RiMenu3Fill2, IoCloseOutline: IoCloseOutline2 } = ReactIcons;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleChannelClick = () => {
    dispatch(openChannel());
  };
  const renderMenuItems = (menuList) => menuList.map((item) => /* @__PURE__ */ jsx("li", { children: item.name === "channels" ? /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleChannelClick,
      className: "rounded-full py-1.5 px-3.5 flex flex-row flex-wrap items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed]",
      children: [
        item.icon && item.icon,
        item.name
      ]
    }
  ) : /* @__PURE__ */ jsxs(
    Link,
    {
      className: "rounded-full py-1.5 px-3.5 flex flex-row flex-wrap items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed]",
      to: item.path || "#",
      children: [
        item.icon && item.icon,
        item.name
      ]
    }
  ) }, item.id));
  return /* @__PURE__ */ jsx("header", { className: "relative top-0 left-0 right-0 py-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center justify-between w-full", children: [
      /* @__PURE__ */ jsx(Link, { className: "block w-fit", to: "/", children: /* @__PURE__ */ jsx(
        "img",
        {
          className: "w-28 sm:w-28 md:w-32 lg:w-40",
          src: Logo,
          alt: "bijolis",
          loading: "lazy",
          decoding: "async"
        }
      ) }),
      /* @__PURE__ */ jsx("nav", { className: "hidden lg:flex flex-col flex-wrap py-1.5 px-2.5 rounded-full text-white bg-section-title", children: /* @__PURE__ */ jsx("ul", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: (auth == null ? void 0 : auth.tokens) && auth.user ? renderMenuItems(Menu) : renderMenuItems(NONAUTHMenu) }) }),
      auth.tokens && auth.user ? /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-row flex-wrap items-center", children: [
        /* @__PURE__ */ jsx(Link, { className: "p-2.5", to: "/", children: /* @__PURE__ */ jsx(IoMdNotifications2, { className: "text-2xl" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("button", { className: "py-[0.688rem] px-[2.125rem] pr-6 rounded-[1.875rem] uppercase text-white border border-purple bg-purple transition-all duration-[0.3s] flex items-center gap-2 text-base leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-[#8c8888] focus:border-[#8c8888] xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito", children: [
          (_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.name,
          /* @__PURE__ */ jsx(MdOutlineKeyboardArrowDown2, {}),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#0000] border border-[#8c8888] rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block", children: [
            /* @__PURE__ */ jsx(Link, { className: "text-section-title text-[0.688rem] uppercase block hover:text-purple py-0.5", to: "/", children: "Pay History" }),
            /* @__PURE__ */ jsx(Link, { className: "text-section-title text-[0.688rem] uppercase block hover:text-purple py-0.5", to: "/", children: "Support" }),
            /* @__PURE__ */ jsx(Link, { className: "text-section-title text-[0.688rem] uppercase block hover:text-purple py-0.5", to: "/", children: "Logout" })
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-row flex-wrap items-center gap-x-8 text-base font-normal", children: [
        /* @__PURE__ */ jsx(Link, { className: "py-3 px-10 border rounded-full uppercase text-black", to: "/login/", children: "login" }),
        /* @__PURE__ */ jsx(Link, { className: "py-3 px-10 border rounded-full uppercase text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed] ", to: "/register/", children: "sign up" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "block lg:hidden", type: "button", onClick: () => setIsMenuShow(!isMenuShow), children: isMenuShow ? /* @__PURE__ */ jsx(IoCloseOutline2, { className: "text-3xl sm:text-4xl" }) : /* @__PURE__ */ jsx(RiMenu3Fill2, { className: "text-2xl sm:text-3xl" }) })
    ] }),
    isMenuShow && /* @__PURE__ */ jsx(MobileMenu, {})
  ] }) });
};
const demoVideo = "/assets/demo-CJO13l8s.mp4";
const Channels = () => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeChannel());
  };
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] p-[1.625rem] px-4 md:p-[1.625rem] flex flex-col relative", children: [
    /* @__PURE__ */ jsx("button", { className: "cursor-pointer absolute right-4 top-[1.625rem]", onClick: handleClose, children: /* @__PURE__ */ jsx("svg", { className: "w-[0.859rem] fill-[#858796]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 384 512", children: /* @__PURE__ */ jsx(
      "path",
      {
        d: "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
      }
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(
      "video",
      {
        className: "max-w-[23.75rem] w-full rounded",
        controls: true,
        loop: true,
        src: demoVideo
      }
    ) }),
    /* @__PURE__ */ jsx("h2", { className: "text-transparent capitalize bg-gradient-to-r from-[#384ef4] to-[#b060ed] bg-clip-text text-[2.5rem] font-bold text-center leading-normal", children: "broadcast channels" }),
    /* @__PURE__ */ jsx("p", { className: "max-w-[31.25rem] mx-auto text-center text-xl md:text-lg text-[#1b1b1b] leading-[1.4]", children: "Join our broadcast channels for exclusive crypto and stock insights, and track Waqar Zaka's investments." }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5 mt-[1.875rem] md:gap-4 md:flex-row md:justify-center", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[1.063rem] md:text-xl leading-normal text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-center min-w-[14.25rem] uppercase transition-all duration-[0.5s] ease-in hover:bg-none hover:text-[#140751] outline-none border border-[#140751] hover:border-[#140751]",
          to: "/",
          target: "_blank",
          children: "Insta Broadcast"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[1.063rem] md:text-xl leading-normal hover:text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] hover:bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-center min-w-[14.25rem] uppercase transition-all duration-[0.5s] ease-in bg-none text-[#140751] outline-none border border-[#140751] hover:border-[#140751]",
          to: "/",
          target: "_blank",
          children: "Insta Broadcast"
        }
      )
    ] })
  ] }) }) });
};
const SeeMore = () => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeSeeMore());
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 flex justify-center items-center overflow-y-auto",
      id: "seemore-popup",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-gradient-to-r from-[#384ef4] to-[#b060ed] rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]",
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-white rounded-[20px] p-[3.125rem] px-4 md:px-[1.625rem] flex flex-col relative",
              children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "cursor-pointer absolute right-4 top-[1.625rem]",
                    onClick: handleClose,
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-[0.859rem] fill-[#858796]",
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 384 512",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            d: "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                          }
                        )
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "space-y-[0.313rem]", children: [
                  /* @__PURE__ */ jsx("p", { children: "By joining our paid program, you will gain access to real-time investment insights from Waqar Zaka, a day trader and early-stage investor in crypto projects. Some days, you may see multiple spot and futures trades; other times, there may be no trades for weeks—it all depends on market conditions. There is no fixed schedule for trades, and this is not a signal group. Waqar Zaka shares where he is investing, and you must make your own decisions based on your financial knowledge and risk tolerance." }),
                  /* @__PURE__ */ jsx("p", { children: "This program includes both text-based learning and video content, with live market updates twice a day where we showcase real-time trades. However, we do not guarantee profits or financial success. Like a gym membership, results depend on individual effort—only those who actively learn and apply the knowledge may benefit." }),
                  /* @__PURE__ */ jsx("p", { children: "Important: We will never ask you to send money to us or any individual claiming to be Waqar Zaka. We are an educational platform, not portfolio managers. If you seek portfolio management services, consider professional firms like BlackRock USA." }),
                  /* @__PURE__ */ jsx("p", { children: "No Refund Policy: There are no refunds under any circumstances. It is your responsibility to thoroughly research before purchasing a subscription. This paid service only provides exclusive content on where and how Waqar Zaka is investing—it does not guarantee profits. No one in the world can guarantee returns; if someone claims otherwise, they are scammers. If guaranteed profits were possible, firms like BlackRock would advertise them—yet they don’t, because such guarantees do not exist." })
                ] })
              ]
            }
          )
        }
      )
    }
  );
};
const configurationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFooterLogo: builder.query({
      query: () => "/configuration/footer-logo/"
    }),
    getBanner: builder.query({
      query: () => "/configuration/banner/"
    }),
    getTeam: builder.query({
      query: () => "/configuration/teams/"
    }),
    getWhy_us: builder.query({
      query: () => "/configuration/why-choose-us/"
    }),
    getService: builder.query({
      query: () => "/configuration/services/"
    }),
    getOfficialInfo: builder.query({
      query: () => "/configuration/official-info/"
    }),
    getAbout: builder.query({
      query: () => "/configuration/about/"
    })
  })
});
const {
  useGetFooterLogoQuery,
  useGetBannerQuery,
  useGetTeamQuery,
  useGetWhy_usQuery,
  useGetServiceQuery,
  useGetOfficialInfoQuery,
  useGetAboutQuery
} = configurationApi;
const Footer = () => {
  var _a, _b, _c, _d, _e, _f, _g;
  const { data: footerLogo } = useGetFooterLogoQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: officialInfo } = useGetOfficialInfoQuery(void 0, { refetchOnMountOrArgChange: true });
  const { RiFacebookCircleLine: RiFacebookCircleLine2, FaInstagram: FaInstagram2, RiTwitterXFill: RiTwitterXFill2, CiLinkedin: CiLinkedin2 } = ReactIcons;
  return /* @__PURE__ */ jsx("footer", { className: "relative top-0 left-0 right-0 py-5 lg:py-10 w-full text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 w-full pb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx(Link, { className: "block w-fit", to: "/", children: /* @__PURE__ */ jsx("img", { className: "w-24 sm:w-28 md:w-32 lg:w-40", src: `${MEDIA_URL}${(_a = footerLogo == null ? void 0 : footerLogo.data) == null ? void 0 : _a.logo}`, alt: "bijolis", loading: "lazy", decoding: "async" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal line-clamp-4", children: (_b = footerLogo == null ? void 0 : footerLogo.data) == null ? void 0 : _b.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium uppercase", children: "Resources" }),
        /* @__PURE__ */ jsxs("ul", { className: "flex flex-col flex-wrap gap-y-1.5 lg:gap-y-2.5 w-full text-sm lg:text-base font-normal", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "About" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Services" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Terms & conditions" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Privacy Policy" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm lg:text-lg font-medium uppercase", children: "Official Info" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: "Address : " }),
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: (_c = officialInfo == null ? void 0 : officialInfo.data) == null ? void 0 : _c.Address })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: "Email : " }),
            /* @__PURE__ */ jsx(Link, { className: "text-sm lg:text-base font-normal", to: `mailto:${(_d = officialInfo == null ? void 0 : officialInfo.data) == null ? void 0 : _d.email}`, target: "_blank", children: (_e = officialInfo == null ? void 0 : officialInfo.data) == null ? void 0 : _e.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: "Number : " }),
            /* @__PURE__ */ jsx(Link, { className: "text-sm lg:text-base font-normal", to: `tel:${(_f = officialInfo == null ? void 0 : officialInfo.data) == null ? void 0 : _f.number}`, target: "_blank", children: (_g = officialInfo == null ? void 0 : officialInfo.data) == null ? void 0 : _g.number })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm lg:text-lg font-medium uppercase", children: "social link" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5 lg:gap-x-5", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(RiFacebookCircleLine2, { className: "text-xl lg:text-2xl" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(FaInstagram2, { className: "text-xl lg:text-2xl" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(RiTwitterXFill2, { className: "text-xl lg:text-2xl" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(CiLinkedin2, { className: "text-xl lg:text-2xl" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center py-5 w-full border-t border-b border-t-white border-b-white", children: /* @__PURE__ */ jsxs("p", { className: "text-xs lg:text-sm font-normal text-center", children: [
      "Copyright © 2025 Waqar Zaka All Rights Reserved. Develop by ",
      /* @__PURE__ */ jsx(Link, { to: "https://dreamlabit.com/", target: "_blank", children: "Dreamlabit" }),
      " Capital Media LLC"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap justify-center items-center gap-y-2.5 lg:gap-y-5 py-5 w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap justify-center items-center gap-y-2.5", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm lg:text-lg font-medium text-center", children: "LEGAL DISCLAIMER & TERMS OF USE/CONDITIONS" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: "Last Updated: 20.03.2025" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap items-center justify-center w-full lg:w-[60%]", children: /* @__PURE__ */ jsxs("p", { className: "text-xs lg:text-sm font-normal text-justify lg:text-center", children: [
        'Welcome to www.waqarzaka.net (the "Website"). By accessing or using this Website, you agree to the following disclaimers, terms, and policies. If you do not agree with any part of this disclosure, please discontinue use immediately. ',
        /* @__PURE__ */ jsx("span", { className: "underline", children: "See More" })
      ] }) })
    ] })
  ] }) }) });
};
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&family=Nunito:wght@400;600;700&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsx(AppContent, {}) });
}
function AppContent() {
  const channelOpen = useSelector((state) => state.popup.channel);
  const seemoreOpen = useSelector((state) => state.popup.seemore);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    channelOpen && /* @__PURE__ */ jsx(Channels, {}),
    seemoreOpen && /* @__PURE__ */ jsx(SeeMore, {}),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(Notification, {}),
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/payments/create-checkout-session/",
        method: "POST",
        body: data
      })
    })
  })
});
const {
  useCreateCheckoutSessionMutation
} = paymentsApi;
function Subscription() {
  var _a;
  const auth = useSelector((state) => state.auth);
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();
  const handlePayment = async () => {
    try {
      const res = await createCheckoutSession({}).unwrap();
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert("Something went wrong. No URL received.");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Please try again.");
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "max-w-[62.5rem] mx-auto p-1 rounded-[1.25rem] bg-linear-[90deg,#384ef4,#b060ed]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[1.125rem] py-5 px-[0.438rem] sm:p-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-[1.75rem] leading-[1.2] font-semibold text-center text-title mb-[1.875rem] md:text-[2.188rem] md:mb-[2.813rem]", children: "WE ARE AN EDUCATIONAL PLATFORM" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { children: "🔹 Get exclusive access to our current investments in crypto projects." }),
        /* @__PURE__ */ jsx("p", { children: "🔹 Track our portfolio performance and see what’s working." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { children: "🔍 Where We Are Going to Invest" }),
        /* @__PURE__ */ jsx("p", { children: "🔹 Stay ahead with our future investment plans before anyone else." }),
        /* @__PURE__ */ jsx("p", { children: "🔹 Leverage our in-depth market analysis and research-backed decisions." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { children: "📊 What You Get:" }),
        /* @__PURE__ */ jsx("p", { children: "✅ Insider insights into top crypto projects." }),
        /* @__PURE__ */ jsx("p", { children: "✅ Real-time investment strategies from experienced traders." }),
        /* @__PURE__ */ jsx("p", { children: "✅ Exclusive research reports on market trends and opportunities." }),
        /* @__PURE__ */ jsx("p", { children: "✅ Community discussions and expert opinions." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "💳 Subscription Details: ",
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: "10$ Monthly" })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "🔁 Monthly Recurring Subscription – You’ll be charged automatically after ",
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: "30 Days" }),
          " completed."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsx("span", { children: (_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.email }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition sm:text-xl",
          type: "button",
          disabled: isLoading,
          onClick: handlePayment,
          children: isLoading ? "Processing..." : "PAY NOW"
        }
      )
    ] })
  ] }) }) }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Subscription
}, Symbol.toStringTag, { value: "Module" }));
const MAinDashboard = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative"
        }
      )
    }
  ) }) });
};
function Dashboard() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx(MAinDashboard, {}) }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => {
  return [
    { title: "checkout" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
function Checkout() {
  return /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx("h2", { children: "checkout" }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Checkout,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const Field = ({ label, children, htmlFor, error }) => {
  const getChildId = (children2) => {
    var _a;
    const child = React.Children.only(children2);
    return (_a = child == null ? void 0 : child.props) == null ? void 0 : _a.id;
  };
  const id = htmlFor || getChildId(children);
  return /* @__PURE__ */ jsxs(React.Fragment, { children: [
    label && /* @__PURE__ */ jsx("label", { className: "text-sm md:text-base font-medium", htmlFor: id, children: label }),
    children,
    (error == null ? void 0 : error.message) && /* @__PURE__ */ jsx("p", { className: "text-red-500 font-medium text-sm", role: "alert", children: error.message })
  ] });
};
const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addRegister: builder.mutation({
      query: (data) => ({
        url: "/accounts/user/register/",
        method: "POST",
        body: data
      })
    }),
    addLogin: builder.mutation({
      query: (data) => ({
        url: "/accounts/user/login/",
        method: "POST",
        body: data
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        var _a, _b;
        try {
          const { data } = await queryFulfilled;
          const authData = {
            user: data.data.user,
            tokens: {
              access_token: data.data.tokens.access_token,
              refresh_token: data.data.tokens.refresh_token
            }
          };
          dispatch(setAuth(authData));
        } catch (err) {
          const errorMsg = ((_b = (_a = err == null ? void 0 : err.error) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Login failed!";
          console.error("Login time error:", errorMsg);
        }
      }
    })
  })
});
const { useAddRegisterMutation, useAddLoginMutation } = authApi;
const RegisterForm = () => {
  const navigate = useNavigate();
  const [addRegister, { isLoading, isError, isSuccess }] = useAddRegisterMutation();
  const [isShow, setIsShow] = useState({
    password: false,
    confirm_password: false
  });
  const [hovered, setHovered] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { IoMdEyeOff: IoMdEyeOff2, IoEye: IoEye2 } = ReactIcons;
  const togglePasswordVisibility = (field) => {
    setIsShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const onSubmitForm = async (formData) => {
    var _a;
    try {
      await addRegister(formData).unwrap();
      toast.success("Registered successfully!");
      reset();
      navigate("/login/");
    } catch (err) {
      if ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.message) {
        toast.error(err.data.message);
      } else if (err == null ? void 0 : err.message) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong during registration.");
      }
    }
  };
  return /* @__PURE__ */ jsxs(
    "form",
    {
      className: "flex flex-col flex-wrap gap-y-5 w-full",
      onSubmit: handleSubmit(onSubmitForm),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.name, children: /* @__PURE__ */ jsx(
          "input",
          {
            ...register("name", { required: "Name is required" }),
            id: "name",
            placeholder: "Name",
            type: "text",
            className: "input"
          }
        ) }) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.email, children: /* @__PURE__ */ jsx(
          "input",
          {
            ...register("email", { required: "Email is required" }),
            id: "email",
            placeholder: "Email",
            type: "email",
            className: "input"
          }
        ) }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.number, children: /* @__PURE__ */ jsx(
            "input",
            {
              ...register("number", { required: "Number is required" }),
              id: "number",
              placeholder: "Enter Whatsapp Number",
              type: "text",
              className: "input"
            }
          ) }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.country, children: /* @__PURE__ */ jsx(
            "input",
            {
              ...register("country", { required: "Country is required" }),
              id: "country",
              placeholder: "Country",
              type: "text",
              className: "input"
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.date_of_birth, children: /* @__PURE__ */ jsx(
          "input",
          {
            ...register("date_of_birth", {
              required: "Date of birth is required"
            }),
            id: "date_of_birth",
            type: "date",
            className: "input"
          }
        ) }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.password, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ...register("password", { required: "Password is required" }),
                id: "password",
                type: isShow.password ? "text" : "password",
                placeholder: "Password",
                className: "input w-full"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => togglePasswordVisibility("password"),
                className: "absolute right-2 top-1/2 -translate-y-1/2",
                children: isShow.password ? /* @__PURE__ */ jsx(IoMdEyeOff2, { className: "text-gray-600 text-lg" }) : /* @__PURE__ */ jsx(IoEye2, { className: "text-gray-600 text-lg" })
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.confirm_password, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ...register("confirm_password", {
                  required: "Confirm password is required"
                }),
                id: "confirm_password",
                type: isShow.confirm_password ? "text" : "password",
                placeholder: "Confirm Password",
                className: "input w-full"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => togglePasswordVisibility("confirm_password"),
                className: "absolute right-2 top-1/2 -translate-y-1/2",
                children: isShow.confirm_password ? /* @__PURE__ */ jsx(IoMdEyeOff2, { className: "text-gray-600 text-lg" }) : /* @__PURE__ */ jsx(IoEye2, { className: "text-gray-600 text-lg" })
              }
            )
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.signature, children: /* @__PURE__ */ jsx(
          "input",
          {
            ...register("signature", { required: "Signature is required" }),
            id: "signature",
            placeholder: "Signature",
            type: "text",
            className: "input"
          }
        ) }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.gender, children: /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("gender", { required: "Gender is required" }),
              className: "input",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Gender" }),
                /* @__PURE__ */ jsx("option", { value: "male", children: "Male" }),
                /* @__PURE__ */ jsx("option", { value: "female", children: "Female" }),
                /* @__PURE__ */ jsx("option", { value: "other", children: "Other" })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.role, children: /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("role", { required: "Account type is required" }),
              className: "input",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Account Type" }),
                /* @__PURE__ */ jsx("option", { value: "crypto", children: "Crypto" }),
                /* @__PURE__ */ jsx("option", { value: "e-commerce", children: "E-commerce" })
              ]
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 justify-center items-center lg:justify-normal lg:items-start w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.terms_accepted, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ...register("terms_accepted", {
                  required: "You must accept the terms"
                }),
                type: "checkbox",
                id: "terms_accepted",
                className: "w-4 lg:w-5 h-4 lg:h-5"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm lg:text-base", children: [
              "I agree to the",
              " ",
              /* @__PURE__ */ jsx(Link, { to: "/", className: "text-blue-600 underline", children: "Terms & Conditions" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-center lg:justify-end items-center lg:items-end", children: /* @__PURE__ */ jsx(Link, { className: "text-blue-600 text-sm lg:text-base underline", to: "/login/", children: "Already have an account?" }) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(
          "button",
          {
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false),
            className: `text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-500 border ${hovered ? "bg-transparent text-black border-black" : "bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white"}`,
            type: "submit",
            children: isLoading ? "Submitting..." : "Submit"
          }
        ) })
      ]
    }
  );
};
const meta$2 = () => {
  return [
    { title: "Bijolis - Register From" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
function Register() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("section", { className: "relation top-0 left-0 right-0 py-10 lg:py-20 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full lg:w-[70%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full py-5 lg:py-10 px-2.5 lg:px-10 gap-y-10 bg-white rounded-[18px]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-medium uppercase text-center", children: "Signup" }),
    /* @__PURE__ */ jsx(RegisterForm, {})
  ] }) }) }) }) }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const About = () => {
  var _a, _b, _c;
  const { data } = useGetAboutQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-16 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "py-[1.563rem] px-[0.938rem] sm:p-[3.125rem] rounded-[1.125rem] text-white  bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-white mb-5 text-center text-6xl font-bold", children: "About" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse gap-6 lg:gap-0 lg:flex-row items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:w-[58.33%] lg:pr-3", children: [
        /* @__PURE__ */ jsx("h5", { className: "mb-[1.875rem] text-[1.188rem] md:text-[1.438rem]", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.title }),
        /* @__PURE__ */ jsx("p", { className: "mb-10 text-[#ddd]", children: (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.description }),
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "min-w-[10.313rem] inline-block bg-section-title border-2 border-section-title rounded-[1.875rem] text-white py-2.5 px-5 text-center uppercase transition-all duration-[0.3s] hover:bg-white hover:border-white hover:text-section-title",
            href: "/login/",
            children: "Enroll Now"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:w-[41.66%] lg:pl-3", children: /* @__PURE__ */ jsx("img", { className: "rounded", src: `${MEDIA_URL}${(_c = data == null ? void 0 : data.data) == null ? void 0 : _c.image}`, alt: "" }) })
    ] })
  ] }) }) });
};
const Banner = () => {
  var _a, _b, _c, _d;
  const { data } = useGetBannerQuery(void 0, { refetchOnMountOrArgChange: true });
  const { MdArrowRightAlt: MdArrowRightAlt2, FaFacebook: FaFacebook2 } = ReactIcons;
  const dispatch = useDispatch();
  const handleOpen = () => {
    dispatch(openSeeMore());
  };
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-16 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "uppercase text-purple text-2xl font-semibold", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.sub_title }),
      /* @__PURE__ */ jsx("h1", { className: "mb-5 text-purple text-6xl font-bold mt-2.5", children: (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.title }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-4 text-body-color", children: /* @__PURE__ */ jsx("p", { children: (_c = data == null ? void 0 : data.data) == null ? void 0 : _c.description }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsx("button", { className: "text-purple underline", type: "button", onClick: handleOpen, children: "See More" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5 flex-wrap mb-10", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "p-2.5 px-4 text-center bg-[#2f8aff] rounded-[1.875rem] text-white uppercase flex items-center justify-center gap-2.5 text-[0.938rem] transition-all duration-[0.3s] ease-in transform hover:scale-[1.1] basis-full md:basis-auto",
            to: "/",
            children: "JOIN GODZILLA TRADING"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "p-2.5 px-4 text-center bg-[#2f8aff] rounded-[1.875rem] text-white uppercase flex items-center justify-center gap-2.5 text-[0.938rem] transition-all duration-[0.3s] ease-in transform hover:scale-[1.1] basis-full md:basis-auto cursor-pointer",
            id: "annual-popup",
            children: [
              /* @__PURE__ */ jsx(FaFacebook2, { className: "text-xl" }),
              "Annual Group"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
        "button",
        {
          className: "flex items-center p-[0.313rem] border border-[#8c8888] rounded-[1.875rem] uppercase text-section-title cursor-pointer w-full",
          type: "button",
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "grow text-center",
                children: "Explore Our Channels"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-[#636abc] size-10 rounded-full flex items-center justify-center shrink-0",
                children: /* @__PURE__ */ jsx(MdArrowRightAlt2, { className: "text-xl text-white" })
              }
            )
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full h-full", children: /* @__PURE__ */ jsx(
      "video",
      {
        className: "w-full h-auto rounded-2xl",
        controls: true,
        src: `${MEDIA_URL}${(_d = data == null ? void 0 : data.data) == null ? void 0 : _d.video}`
      }
    ) })
  ] }) }) });
};
const Services = () => {
  var _a;
  const { data } = useGetServiceQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-16 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-10 w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center text-center w-full", children: /* @__PURE__ */ jsxs("h2", { className: "flex flex-col mb-10 text-6xl font-bold", children: [
      "Explore our ",
      /* @__PURE__ */ jsx("span", { className: "text-purple", children: " Education services" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-[1.875rem] sm:grid-cols-2 lg:grid-cols-3", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.map((item) => {
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "w-full max-w-full object-cover",
            src: `${MEDIA_URL}${item.image}`,
            alt: ""
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[#202020]", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-[#6f6f6f]", children: item.description })
        ] })
      ] });
    }) })
  ] }) }) });
};
const Team = () => {
  var _a;
  const { data } = useGetTeamQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-16 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap items-center justify-center w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full", children: /* @__PURE__ */ jsxs("h2", { className: "text-4xl lg:text-5xl font-bold text-center", children: [
      "Team ",
      /* @__PURE__ */ jsx("br", {}),
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-purple mt-1.5", children: "Acknowledgements" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.map((item) => {
      return /* @__PURE__ */ jsxs(Link, { className: "relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 top-0 hover:shadow-[0_7px_10px_-1px_#000000bf] hover:top-[-10px]", to: item.link || "/", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(180deg,#0000_17.5%,#000_78%)]" }),
        /* @__PURE__ */ jsx("img", { src: `${MEDIA_URL}${item.image}`, alt: item.title }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 py-5 px-4 md:px-[25px] text-white text-center", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-lg sm:text-[23px] font-medium leading-[1.3] mb-[10px]", children: item.title }),
          /* @__PURE__ */ jsx("p", { children: item.description }),
          /* @__PURE__ */ jsx(Link, { className: "text-white", to: "/", children: "Learn More" })
        ] })
      ] }, item.id);
    }) })
  ] }) }) });
};
const Why_Us = () => {
  var _a;
  const { data } = useGetWhy_usQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-16 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.map((item) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "pt-12 px-5 pb-[1.875rem] flex flex-col gap-5 bg-cover bg-no-repeat bg-center rounded-md",
        style: { backgroundImage: `url(${MEDIA_URL}${item.image})` },
        children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { src: `${MEDIA_URL}${item.sub_image}`, alt: "" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-white", children: [
            /* @__PURE__ */ jsx("h5", { className: "mb-2", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs leading-normal", children: item.description })
          ] })
        ]
      }
    );
  }) }) }) });
};
const meta$1 = () => {
  return [
    { title: "bjollys" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
function Index() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsxs("section", { className: "relative top-0 left-0 right-0 w-full", children: [
    /* @__PURE__ */ jsx(Banner, {}),
    /* @__PURE__ */ jsx(Team, {}),
    /* @__PURE__ */ jsx(Why_Us, {}),
    /* @__PURE__ */ jsx(Services, {}),
    /* @__PURE__ */ jsx(About, {})
  ] }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const LoginForm = () => {
  const [addLogin, { isLoading }] = useAddLoginMutation();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { IoEye: IoEye2, IoMdEyeOff: IoMdEyeOff2 } = ReactIcons;
  const onSubmitForm = async (formData) => {
    try {
      await addLogin(formData).unwrap();
      toast.success("Login successfully");
      navigate("/");
      reset();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  return /* @__PURE__ */ jsxs("form", { className: "flex flex-col flex-wrap gap-y-5 w-full", onSubmit: handleSubmit(onSubmitForm), children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.email, children: /* @__PURE__ */ jsx("input", { ...register("email", {
      required: "Email is required"
    }), className: "text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none", type: "email", name: "email", id: "email", placeholder: "Email" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.password, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap w-full relative", children: [
      /* @__PURE__ */ jsx("input", { ...register("password", {
        required: "Password is required"
      }), className: "text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none w-full", type: isShow ? "text" : "password", name: "password", id: "password", placeholder: "Password" }),
      /* @__PURE__ */ jsx("button", { className: "absolute right-2 top-1/2 -translate-y-1/2", type: "button", onClick: () => setIsShow(!isShow), children: isShow ? /* @__PURE__ */ jsx(IoMdEyeOff2, { className: "text-gray-600 text-lg" }) : /* @__PURE__ */ jsx(IoEye2, { className: "text-gray-600 text-lg" }) })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center justify-between w-full", children: [
      /* @__PURE__ */ jsx(Link, { to: "/register/", children: "Create New Account?" }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: "Forget Password?" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(
      "button",
      {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        className: `text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-500 border ${hovered ? "bg-transparent text-black border-black" : "bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white"}`,
        type: "submit",
        children: "Submit"
      }
    ) })
  ] });
};
const meta = () => {
  return [
    { title: "Bijolis - Login From" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};
function Login() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("section", { className: "relation top-0 left-0 right-0 py-20 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full lg:w-[70%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full py-5 lg:py-10 px-2.5 lg:px-10 bg-white rounded-[18px]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-medium uppercase py-5 lg:py-10 text-center", children: "Login" }),
    /* @__PURE__ */ jsx(LoginForm, {})
  ] }) }) }) }) }) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CRDHeoIx.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/components-DvU-JqrC.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BmmMUwcB.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/components-DvU-JqrC.js", "/assets/index-CHqNmqgh.js", "/assets/apiSlice-OAb5xsuK.js", "/assets/configurationApi-PtzFywFl.js", "/assets/reactIcons-Dmpet-QG.js"], "css": ["/assets/root-vxp8--zS.css"] }, "routes/subscription": { "id": "routes/subscription", "parentId": "root", "path": "subscription", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/subscription-CFijJVvL.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/apiSlice-OAb5xsuK.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-WEshmvGM.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/checkout": { "id": "routes/checkout", "parentId": "root", "path": "checkout", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/checkout-iFHJle2P.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/register-Nz2zv5-O.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/authApi-CGylCeoq.js", "/assets/reactIcons-Dmpet-QG.js", "/assets/index-CHqNmqgh.js", "/assets/components-DvU-JqrC.js", "/assets/apiSlice-OAb5xsuK.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-Dof-2R6N.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/configurationApi-PtzFywFl.js", "/assets/apiSlice-OAb5xsuK.js", "/assets/reactIcons-Dmpet-QG.js", "/assets/components-DvU-JqrC.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-Cvwg03Mj.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/authApi-CGylCeoq.js", "/assets/reactIcons-Dmpet-QG.js", "/assets/index-CHqNmqgh.js", "/assets/components-DvU-JqrC.js", "/assets/apiSlice-OAb5xsuK.js"], "css": [] } }, "url": "/assets/manifest-e3e7ea6f.js", "version": "e3e7ea6f" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/subscription": {
    id: "routes/subscription",
    parentId: "root",
    path: "subscription",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/checkout": {
    id: "routes/checkout",
    parentId: "root",
    path: "checkout",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
