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
import React, { useState, useEffect } from "react";
import { HiMiniHome as HiMiniHome$1 } from "react-icons/hi2";
import { IoMdEyeOff, IoMdNotifications } from "react-icons/io";
import { MdArrowRightAlt, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiMenu3Fill, RiFacebookCircleLine, RiTwitterXFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { IoEye, IoCloseOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
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
    seemore: false,
    footer_seemore: false
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
    },
    openFooterSeeMore: (state) => {
      state.footer_seemore = true;
    },
    closeFooterSeeMore: (state) => {
      state.footer_seemore = false;
    }
  }
});
const {
  openChannel,
  closeChannel,
  openSeeMore,
  closeSeeMore,
  openFooterSeeMore,
  closeFooterSeeMore
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
const configurationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogo: builder.query({
      query: () => "/configuration/logo/"
    }),
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
    }),
    getCryptoTrades: builder.query({
      query: () => "/configuration/crypto-trades/"
    }),
    getStockCommoditiesTrades: builder.query({
      query: () => "/configuration/stock-commodities-trades/"
    }),
    getMarketUpdates: builder.query({
      query: () => "configuration/market-updates/"
    }),
    getEducation: builder.query({
      query: () => "/configuration/education/"
    }),
    getEcommerceService: builder.query({
      query: () => "/configuration/ecommerce-service/"
    }),
    getEcommerceVideo: builder.query({
      query: () => "/configuration/e-commerce-video/"
    })
  })
});
const {
  useGetLogoQuery,
  useGetFooterLogoQuery,
  useGetBannerQuery,
  useGetTeamQuery,
  useGetWhy_usQuery,
  useGetServiceQuery,
  useGetOfficialInfoQuery,
  useGetAboutQuery,
  useGetCryptoTradesQuery,
  useGetStockCommoditiesTradesQuery,
  useGetMarketUpdatesQuery,
  useGetEducationQuery,
  useGetEcommerceServiceQuery,
  useGetEcommerceVideoQuery
} = configurationApi;
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
    path: "/#services",
    icon: void 0
  },
  {
    id: 4,
    name: "about",
    path: "/#about",
    icon: void 0
  },
  {
    id: 5,
    name: "e-commerce",
    path: "/e-commerce/",
    icon: void 0
  },
  {
    id: 6,
    name: "Crypto",
    path: "/crypto/subscription/",
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
    path: "/#services",
    icon: void 0
  },
  {
    id: 4,
    name: "about",
    path: "/#about",
    icon: void 0
  },
  {
    id: 5,
    name: "e-commerce",
    path: "/e-commerce/",
    icon: void 0
  },
  {
    id: 7,
    name: "Crypto",
    path: "/crypto/subscription/",
    icon: void 0
  },
  {
    id: 8,
    name: "subscription",
    path: "/subscription/",
    icon: void 0
  },
  {
    id: 9,
    name: "dashboard",
    path: "/dashboard/",
    icon: void 0
  }
];
const MobileMenu = () => {
  const auth = useSelector((state) => state.auth);
  const { IoMdNotifications: IoMdNotifications2, MdOutlineKeyboardArrowDown: MdOutlineKeyboardArrowDown2 } = ReactIcons;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full gap-y-2.5 py-5", children: [
    /* @__PURE__ */ jsx("nav", { className: "flex flex-col flex-wrap py-1.5 px-2.5 rounded-xl text-white bg-section-title", children: /* @__PURE__ */ jsx("ul", { className: "flex flex-col flex-wrap items-center gap-y-2.5", children: (auth == null ? void 0 : auth.tokens) && auth.user ? /* @__PURE__ */ jsx(Fragment, { children: Menu == null ? void 0 : Menu.map((item) => {
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
    }) }) : /* @__PURE__ */ jsx(Fragment, { children: NONAUTHMenu == null ? void 0 : NONAUTHMenu.map((item) => {
      var _a;
      return /* @__PURE__ */ jsx("li", { children: item.name === "channels" ? /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
          },
          className: "rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed] cursor-pointer",
          children: [
            item.icon && item.icon,
            item.name
          ]
        }
      ) : ((_a = item.path) == null ? void 0 : _a.startsWith("/#")) ? /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            if (item.path) {
              const element = document.getElementById(item.path.replace("/#", ""));
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }
          },
          className: "rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed] cursor-pointer",
          children: [
            item.icon && item.icon,
            item.name
          ]
        }
      ) : /* @__PURE__ */ jsxs(
        Link,
        {
          to: item.path || "#",
          className: "rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed]",
          children: [
            item.icon && item.icon,
            item.name
          ]
        }
      ) }, item.id);
    }) }) }) }),
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
  var _a, _b;
  const [isMenuShow, setIsMenuShow] = useState(false);
  const {
    IoMdNotifications: IoMdNotifications2,
    MdOutlineKeyboardArrowDown: MdOutlineKeyboardArrowDown2,
    RiMenu3Fill: RiMenu3Fill2,
    IoCloseOutline: IoCloseOutline2
  } = ReactIcons;
  const { data } = useGetLogoQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const Logo = (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.logo;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleChannelClick = () => {
    dispatch(openChannel());
  };
  const handleSmoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  const renderMenuItems = (menuList) => menuList.map((item) => {
    var _a2;
    return /* @__PURE__ */ jsx("li", { children: item.name === "channels" ? /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: handleChannelClick,
        className: "rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed] cursor-pointer",
        children: [
          item.icon && item.icon,
          item.name
        ]
      }
    ) : ((_a2 = item.path) == null ? void 0 : _a2.startsWith("/#")) ? /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => item.path && handleSmoothScroll(item.path.replace("/#", "")),
        className: "rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed] cursor-pointer",
        children: [
          item.icon && item.icon,
          item.name
        ]
      }
    ) : /* @__PURE__ */ jsxs(
      Link,
      {
        to: item.path || "#",
        className: "rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-[#384ef4] hover:to-[#b060ed]",
        children: [
          item.icon && item.icon,
          item.name
        ]
      }
    ) }, item.id);
  });
  return /* @__PURE__ */ jsx("header", { className: "relative top-0 left-0 right-0 py-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center justify-between w-full", children: [
      /* @__PURE__ */ jsx(Link, { className: "block w-fit", to: "/", children: /* @__PURE__ */ jsx(
        "img",
        {
          className: "w-28 sm:w-28 md:w-32 lg:w-40",
          src: `${MEDIA_URL}${Logo}`,
          alt: "bijolis",
          loading: "lazy",
          decoding: "async"
        }
      ) }),
      /* @__PURE__ */ jsx("nav", { className: "hidden lg:flex flex-col flex-wrap py-1.5 px-2.5 rounded-full text-white bg-section-title", children: /* @__PURE__ */ jsx("ul", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: (auth == null ? void 0 : auth.tokens) && auth.user ? renderMenuItems(Menu) : renderMenuItems(NONAUTHMenu) }) }),
      auth.tokens && auth.user ? /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-row flex-wrap items-center", children: [
        /* @__PURE__ */ jsx(Link, { className: "p-2.5", to: "/", children: /* @__PURE__ */ jsx(IoMdNotifications2, { className: "text-2xl" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("button", { className: "py-[0.688rem] px-[2.125rem] pr-6 rounded-[1.875rem] uppercase text-white border border-purple bg-purple transition-all duration-[0.3s] flex items-center text-base leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-[#8c8888] focus:border-[#8c8888] xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito", children: [
          (_b = auth == null ? void 0 : auth.user) == null ? void 0 : _b.name,
          /* @__PURE__ */ jsx(MdOutlineKeyboardArrowDown2, {}),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#0000] border border-[#8c8888] rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                className: "text-section-title text-[0.688rem] uppercase block hover:text-purple py-0.5",
                to: "/",
                children: "Pay History"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                className: "text-section-title text-[0.688rem] uppercase block hover:text-purple py-0.5",
                to: "/",
                children: "Support"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "text-section-title text-[0.688rem] w-full uppercase block hover:text-purple py-0.5 cursor-pointer",
                type: "button",
                onClick: handleLogout,
                children: "Logout"
              }
            )
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-row flex-wrap items-center gap-x-8 text-base font-normal", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "py-3 px-10 border rounded-full uppercase text-black",
            to: "/login/",
            children: "login"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "py-3 px-10 border rounded-full uppercase text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed]",
            to: "/register/",
            children: "sign up"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "block lg:hidden",
          type: "button",
          onClick: () => setIsMenuShow(!isMenuShow),
          children: isMenuShow ? /* @__PURE__ */ jsx(IoCloseOutline2, { className: "text-3xl sm:text-4xl" }) : /* @__PURE__ */ jsx(RiMenu3Fill2, { className: "text-2xl sm:text-3xl" })
        }
      )
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
const Footer = () => {
  var _a, _b, _c, _d, _e, _f, _g;
  const { data: footerLogo } = useGetFooterLogoQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: officialInfo } = useGetOfficialInfoQuery(void 0, { refetchOnMountOrArgChange: true });
  const { RiFacebookCircleLine: RiFacebookCircleLine2, FaInstagram: FaInstagram2, RiTwitterXFill: RiTwitterXFill2, CiLinkedin: CiLinkedin2 } = ReactIcons;
  const dispatch = useDispatch();
  return /* @__PURE__ */ jsx("footer", { className: "relative top-0 left-0 right-0 py-5 lg:py-10 w-full text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 w-full pb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx(Link, { className: "block w-fit", to: "/", children: /* @__PURE__ */ jsx("img", { className: "w-24 sm:w-28 md:w-32 lg:w-40", src: `${MEDIA_URL}${(_a = footerLogo == null ? void 0 : footerLogo.data) == null ? void 0 : _a.logo}`, alt: "bijolis", loading: "lazy", decoding: "async" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal line-clamp-4", children: (_b = footerLogo == null ? void 0 : footerLogo.data) == null ? void 0 : _b.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium uppercase", children: "Resources" }),
        /* @__PURE__ */ jsxs("ul", { className: "flex flex-col flex-wrap gap-y-1.5 lg:gap-y-2.5 w-full text-sm lg:text-base font-normal", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const el = document.getElementById("about");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              },
              className: "text-left cursor-pointer",
              children: "About"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              },
              className: "text-left cursor-pointer",
              children: "Services"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/terms-and-conditions/", children: "Terms & conditions" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/privacy-policy/", children: "Privacy Policy" }) })
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
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap items-center justify-center w-full lg:w-[65%]", children: /* @__PURE__ */ jsxs("p", { className: "text-xs lg:text-sm font-normal text-justify lg:text-center", children: [
        'Welcome to www.waqarzaka.net (the "Website"). By accessing or using this Website, you agree to the following disclaimers, terms, and policies. If you do not agree with any part of this disclosure, please discontinue use immediately. ',
        /* @__PURE__ */ jsx("span", { className: "underline cursor-pointer", onClick: () => dispatch(openFooterSeeMore()), children: "See More" })
      ] }) })
    ] })
  ] }) }) });
};
const FooterSeeMore = () => {
  const dispatch = useDispatch();
  return /* @__PURE__ */ jsx("div", { className: "fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 flex justify-center items-start overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] px-4 py-[3.125rem] md:px-[1.625rem] flex flex-col relative", children: [
    /* @__PURE__ */ jsx("button", { className: "cursor-pointer absolute right-4 top-[1.625rem]", type: "button", onClick: () => dispatch(closeFooterSeeMore()), children: /* @__PURE__ */ jsx("svg", { className: "w-[0.859rem] fill-[#858796]", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 384 512", children: /* @__PURE__ */ jsx(
      "path",
      {
        d: "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-title font-semibold leading-[1.4] text-[1.375rem] mb-6", children: "Global LEGAL DISCLAIMER & TERMS OF USE/CONDITIONS" }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Last Updated:" }),
        " 20.03.2025"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: 'Welcome to www.waqarzaka.net (the "Website"). By accessing or using this Website, you agree to the following disclaimers, terms, and policies. If you do not agree with any part of this disclosure, please discontinue use immediately.' }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
        "For ",
        /* @__PURE__ */ jsx(Link, { className: "text-[#0d6efd]", to: "/", children: "www.waqarzaka.net" }),
        " & All Associated Signal / Telegram / WhatsApp Groups"
      ] }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "Educational & Informational Use Only" }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
        "All content, crypto signals, trading strategies, commentary, or communications shared via ",
        /* @__PURE__ */ jsx(Link, { className: "text-[#0d6efd]", to: "/", children: "www.waqarzaka.net" }),
        " or its affiliated platforms (including but not limited to Signal, Telegram, WhatsApp, or email) are intended solely for educational and informational purposes."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "They are not a substitute for professional financial, legal, or tax advice." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "No Financial Advice – Opinions Only (with Global Jurisdictional Disclaimer)" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and his team may share personal opinions, trade setups, and buy/sell signals as part of their educational services. However, all such content is provided strictly for informational purposes and does not constitute financial advice, portfolio management, or a recommendation to trade any specific asset." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "You acknowledge and agree that:" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and his team are not licensed financial advisors, brokers, or investment professionals in any jurisdiction, including but not limited to:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The United States (SEC, CFTC, FINRA)," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The United Kingdom (FCA)," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The European Union (ESMA)," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The United Arab Emirates (SCA, DFSA)," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Singapore (MAS) and all other global regulatory bodies." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "All information shared is general in nature, not customized to your financial circumstances, and does not establish any fiduciary duty or client-advisor relationship." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and his team do not solicit, induce, or guarantee any outcome or return. Past performance is not indicative of future results." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "By using our content, you waive all claims of misrepresentation, reliance, market manipulation, or legal liability under any financial services or securities regulation worldwide." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "No Guarantee of Results" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "We make no warranties, express or implied, regarding the accuracy, reliability, timeliness, or future performance of any content." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "You acknowledge that all forms of trading and investing carry inherent risks, including the loss of your entire capital." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "Jurisdictional Restrictions" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Our services are not intended for use in jurisdictions where the transmission or use of such content would be unlawful or restricted." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "You are solely responsible for ensuring your participation complies with local laws, financial regulations, and restrictions." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "Limitation of Liability" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and all related parties (including team members, affiliates, contractors, and contributors) shall not be held liable for any form of damages — direct, indirect, incidental, punitive, or consequential — including but not limited to:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Loss of capital or profits," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Missed trades or opportunities," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Trading errors based on content reliance," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Or emotional, legal, or financial distress." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "This limitation applies regardless of the legal theory, even if advised of the possibility of such damages." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "Personal Responsibility & Risk Acceptance" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "You are solely responsible for:" }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Evaluating all shared information," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Conducting your own due diligence," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Consulting with a qualified financial professional," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Making independent investment or trading decisions." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "By participating, you voluntarily assume all risks, and agree to indemnify and hold harmless Waqar Zaka and associated parties from any legal action, claim, or loss arising out of your use of our services." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "No Refund – No Chargeback Policy" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Due to the nature of digital and educational content, all payments made for services, access, or subscriptions are non-refundable." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "By proceeding with any payment, you waive any right to refunds, disputes, or chargebacks, regardless of perceived results or experience." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "Binding Agreement" }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
        "By accessing ",
        /* @__PURE__ */ jsx("a", { className: "text-[#0d6efd]", href: "#", children: "www.waqarzaka.net" }),
        " or any related groups, you confirm that you:"
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Have read, understood, and accepted this disclaimer in full," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Enter into a binding agreement," }),
        /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "And irrevocably waive any future legal claims based on reliance, misunderstanding, or dissatisfaction." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "This disclaimer shall be governed by applicable international and local laws, and any disputes shall be resolved under the jurisdiction Waqar Zaka or his company designates." }),
      /* @__PURE__ */ jsx("h6", { className: "mb-5", children: "Final Note" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "You trade at your own risk." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and his team are not responsible for your profits, losses, decisions, or emotions." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Your risk. Your decision. Your responsibility." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "GENERAL DISCLAIMER" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "This Website is for educational and informational purposes only. We do not provide financial, investment, legal, or tax advice. Any content, materials, or courses available on this platform should not be construed as professional financial guidance. Before making any trading or investment decisions, consult with a licensed financial advisor, attorney, or tax professional to assess your individual circumstances." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "NO FINANCIAL OR INVESTMENT ADVICE" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "We are not financial advisors, brokers, or investment professionals. No content on this Website constitutes financial, investment, or legal advice. Any financial or trading decisions you make based on our content are at your own risk. Past performance of financial markets, cryptocurrencies, or trading strategies is not indicative of future results." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "Risk Disclosure" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Trading and investing involve substantial risk, including potential loss of your entire investment. The cryptocurrency and forex markets are highly volatile and not suitable for all investors. You should only trade or invest money that you can afford to lose." }),
      /* @__PURE__ */ jsx("h5", { className: "text-title font-semibold leading-[1.4] text-xl mb-2", children: "Personal Responsibility" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "By using this Website, you acknowledge that you are solely responsible for your financial decisions. We are not liable for any financial losses, damages, or negative outcomes from using our educational materials" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "We do not guarantee any specific financial outcomes, earnings, or success from using our content. Any testimonials, success stories, or examples are exceptional cases and not typical results. Your personal financial success depends on various factors outside our control, including market conditions, experience, and risk tolerance." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: 'All information is provided "as is" and "as available", with no warranties of accuracy, completeness, or reliability. We strive to provide up-to-date information, but we do not guarantee that all content is free from errors, omissions, or outdated material. By accessing this Website, you agree that we, our owners, employees, and affiliates are not responsible for any financial losses resulting from your reliance on our content.' }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "This Website may include links to third-party websites, sponsored content, or affiliate promotions." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "We do not own, control, or guarantee the accuracy, reliability, or legitimacy of third-party services. If you engage with third-party services through our links, you do so at your own risk, and we are not responsible for any issues or disputes arising from those engagements. We may earn a commission from affiliate links, but this does not influence our content recommendations." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "By using this Website, you acknowledge that you have read and understood our Privacy Policy, which outlines:" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "What personal data we collect (e.g., email, payment details, analytics)." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "How we use and store data." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Third-party sharing policies" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "User rights, including data deletion requests" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "For more details, refer to our Privacy Policy page." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "All sales of digital products, including courses, are final and non-refundable, except in cases of accidental duplicate purchases" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Users may not copy, distribute, or reproduce any content without written permission. Unauthorized use of our content may result in legal action" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Users must not engage in fraud, harassment, illegal activities, or violation of these terms. We reserve the right to suspend or terminate any user account that violates these terms" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Use of or inability to use our Website." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Errors or inaccuracies in content." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Third-party services or external links." }),
      /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Loss of profits, revenue, or financial losses." }),
      /* @__PURE__ */ jsx("p", { children: "We reserve the right to modify or update this legal disclosure at any time without prior notice. It is your responsibility to review this page periodically for any changes." })
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
      /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/x-icon", href: "/bjollys-favicon.png" }),
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
  const footerSeemoreOpen = useSelector((state) => state.popup.footer_seemore);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    channelOpen && /* @__PURE__ */ jsx(Channels, {}),
    seemoreOpen && /* @__PURE__ */ jsx(SeeMore, {}),
    footerSeemoreOpen && /* @__PURE__ */ jsx(FooterSeeMore, {}),
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
function TermsAndConditions() {
  return /* @__PURE__ */ jsx("section", { className: "pt-[3.75rem] pb-10", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-[1.675rem] font-semibold leading-[1.4] text-title mb-5 md:text-[2.5rem]", children: "Global LEGAL DISCLAIMER & TERMS OF USE/CONDITIONS" }),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Last Updated:" }),
      " 20.03.2025"
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      "Welcome to",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[#0d6efd] font-bold",
          to: "/",
          children: "www.waqarzaka.net"
        }
      ),
      '(the "Website"). By accessing or using this Website, you agree to the following disclaimers, terms, and policies. If you do not agree with any part of this disclosure, please discontinue use immediately.'
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mb-5", children: [
      "For",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[#0d6efd] font-bold",
          to: "/",
          children: "www.waqarzaka.net"
        }
      ),
      "& All Associated Signal / Telegram / WhatsApp Groups"
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "Educational & Informational Use Only"
      }
    ),
    /* @__PURE__ */ jsxs("p", { children: [
      "All content, crypto signals, trading strategies, commentary, or communications shared via",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[#0d6efd] font-bold",
          to: "/",
          children: "www.waqarzaka.net"
        }
      ),
      "or its affiliated platforms (including but not limited to Signal, Telegram, WhatsApp, or email) are intended solely for educational and informational purposes."
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "They are not a substitute for professional financial, legal, or tax advice." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "No Financial Advice – Opinions Only (with Global Jurisdictional Disclaimer)"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and his team may share personal opinions, trade setups, and buy/sell signals as part of their educational services. However, all such content is provided strictly for informational purposes and does not constitute financial advice, portfolio management, or a recommendation to trade any specific asset." }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "You acknowledge and agree that:" }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and his team are not licensed financial advisors, brokers, or investment professionals in any jurisdiction, including but not limited to:" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The United States (SEC, CFTC, FINRA)," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The United Kingdom (FCA)," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The European Union (ESMA)," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The United Arab Emirates (SCA, DFSA)," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Singapore (MAS) and all other global regulatory bodies." })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "All information shared is general in nature, not customized to your financial circumstances, and does not establish any fiduciary duty or client-advisor relationship." }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and his team do not solicit, induce, or guarantee any outcome or return. Past performance is not indicative of future results." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "By using our content, you waive all claims of misrepresentation, reliance, market manipulation, or legal liability under any financial services or securities regulation worldwide." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "No Guarantee of Results"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "We make no warranties, express or implied, regarding the accuracy, reliability, timeliness, or future performance of any content." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "You acknowledge that all forms of trading and investing carry inherent risks, including the loss of your entire capital." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "Jurisdictional Restrictions"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "Our services are not intended for use in jurisdictions where the transmission or use of such content would be unlawful or restricted." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "You are solely responsible for ensuring your participation complies with local laws, financial regulations, and restrictions." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "Limitation of Liability"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Waqar Zaka and all related parties (including team members, affiliates, contractors, and contributors) shall not be held liable for any form of damages — direct, indirect, incidental, punitive, or consequential — including but not limited to:" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Loss of capital or profits," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Missed trades or opportunities," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Trading errors based on content reliance," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Or emotional, legal, or financial distress." })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "This limitation applies regardless of the legal theory, even if advised of the possibility of such damages." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "Personal Responsibility & Risk Acceptance"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "You are solely responsible for:" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Evaluating all shared information," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Conducting your own due diligence," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Consulting with a qualified financial professional," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Making independent investment or trading decisions." })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "By participating, you voluntarily assume all risks, and agree to indemnify and hold harmless Waqar Zaka and associated parties from any legal action, claim, or loss arising out of your use of our services." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "No Refund – No Chargeback Policy"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "Due to the nature of digital and educational content, all payments made for services, access, or subscriptions are non-refundable." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "By proceeding with any payment, you waive any right to refunds, disputes, or chargebacks, regardless of perceived results or experience." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "Binding Agreement"
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      "By accessing",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "font-bold text-[#0d6efd]",
          to: "/",
          children: "www.waqarzaka.net"
        }
      ),
      "or any related groups, you confirm that you:"
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Have read, understood, and accepted this disclaimer in full," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Enter into a binding agreement," }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "And irrevocably waive any future legal claims based on reliance, misunderstanding, or dissatisfaction." })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "This disclaimer shall be governed by applicable international and local laws, and any disputes shall be resolved under the jurisdiction Waqar Zaka or his company designates." }),
    /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Final Note" }),
    /* @__PURE__ */ jsx("p", { children: "You trade at your own risk." }),
    /* @__PURE__ */ jsx("p", { children: "Waqar Zaka and his team are not responsible for your profits, losses, decisions, or emotions." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "Your risk. Your decision. Your responsibility." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "GENERAL DISCLAIMER"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "This Website is for educational and informational purposes only. We do not provide financial, investment, legal, or tax advice. Any content, materials, or courses available on this platform should not be construed as professional financial guidance. Always consult a licensed financial advisor, attorney, or tax professional before making any trading or investment decisions." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "NO FINANCIAL OR INVESTMENT ADVICE"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "We are not financial advisors, brokers, or investment professionals. No content on this Website constitutes financial, investment, or legal advice. Any financial or trading decisions you make based on our content are strictly at your own risk. Past performance is not indicative of future results." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "Risk Disclosure"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "Trading and investing involve substantial risk, including the potential loss of your entire investment. The cryptocurrency and forex markets are highly volatile and not suitable for all investors. Only invest funds that you can afford to lose." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "Personal Responsibility"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "By using this Website, you acknowledge that you are solely responsible for your financial decisions. We do not guarantee any specific financial outcomes or success, and we are not liable for any losses or damages arising from the use of our materials. Testimonials or success stories are exceptional and not typical." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "All content is provided “as is” and “as available,” with no warranties of accuracy, completeness, or reliability. Although we strive to keep information current, we make no guarantees that all content is free from errors or outdated material." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "THIRD-PARTY LINKS AND AFFILIATES"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "This Website may include links to third-party websites, sponsored content, or affiliate promotions. We do not own or control third-party services and are not responsible for their accuracy, reliability, or legitimacy. Interactions with these services are at your own risk. We may receive commissions from affiliate links, but our content is not influenced by these affiliations." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "PRIVACY POLICY"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "By using this Website, you acknowledge that you have read and agreed to our Privacy Policy, which explains:" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "What personal data we collect (e.g., email, payment details, analytics)" }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "How we use and store that data" }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Our third-party sharing practices" }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Your rights, including how to request data deletion" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "Refer to the full [Privacy Policy] page for more information." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "BILLING, PAYMENTS, & SUBSCRIPTIONS"
      }
    ),
    /* @__PURE__ */ jsx("h5", { className: "text-xl leadiing-[1.4] font-semibold text-title mb-2", children: "1. Support Ticket Requirement for Payment Issues" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "If you experience any issues accessing the platform",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "after a successful payment" }),
      ", you must first create a support ticket via our Help Desk. Our support team will aim to resolve your issue",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "within 48 hours" })
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      "If your issue is not resolved after 48 hours, you may then proceed to open a",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "payment dispute or refund request" }),
      "via Stripe."
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("span", { children: "⚠️ Important: " }),
      " Initiating a dispute without first creating a support ticket is a violation of our terms and may result in denied claims."
    ] }),
    /* @__PURE__ */ jsx("h5", { className: "text-xl leadiing-[1.4] font-semibold text-title mb-2", children: "2. Auto-Renewal Subscription Policy" }),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      "By subscribing to our platform, you acknowledge and agree that your",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "subscription renews automatically every month" }),
      "."
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-5", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "The first payment will require your authorization." }),
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        "Subsequent payments will be automatically deducted from your credit card without requiring re-authorization. ",
        /* @__PURE__ */ jsx("br", {}),
        "You may cancel the subscription at any time before the next billing cycle through your account settings."
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "REFUND POLICY"
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mb-5", children: [
      "All sales of digital products, including courses and subscriptions, are",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "final and non-refundable" }),
      ", except in cases of",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "accidental duplicate purchases" }),
      "."
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "CONTENT USAGE & USER CONDUCT"
      }
    ),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-5", children: [
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        "Users may not copy, distribute, or reproduce any content without ",
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "written permission" })
      ] }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Unauthorized use of our content may result in legal action." }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Users must not engage in fraud, harassment, illegal activities, or violation of these terms." }),
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        "We reserve the right to",
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "font-bold",
            children: "suspend or terminate any user account"
          }
        ),
        "that violates these terms."
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "LIMITATION OF LIABILITY"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-5", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Use of or inability to use our Website" }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Errors or inaccuracies in content" }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Third-party services or external links" }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Loss of profits, revenue, or financial data" })
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "MODIFICATIONS"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "We reserve the right to update or modify this legal disclaimer and terms of use at any time without prior notice. It is your responsibility to check this page regularly for updates." })
  ] }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TermsAndConditions
}, Symbol.toStringTag, { value: "Module" }));
const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCryptoCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/payments/create-crypto-checkout-session/",
        method: "POST",
        body: data
      })
    }),
    createEcommerceCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/payments/create-e-commerce-checkout-session/",
        method: "POST",
        body: data
      })
    }),
    getSubscription: builder.query({
      query: () => "/payments/subscription/"
    })
  })
});
const {
  useCreateCryptoCheckoutSessionMutation,
  useCreateEcommerceCheckoutSessionMutation,
  useGetSubscriptionQuery
} = paymentsApi;
function CryptoSubscription() {
  var _a;
  const auth = useSelector((state) => state.auth);
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, { refetchOnMountOrArgChange: true });
  const [createCheckoutSession, { isLoading }] = useCreateCryptoCheckoutSessionMutation();
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
    /* @__PURE__ */ jsx("h1", { className: "text-[1.75rem] leading-[1.2] font-semibold text-center text-title mb-[1.875rem] md:text-[2.188rem] md:mb-[2.813rem]", children: "WE ARE AN CRYPTO PLATFORM" }),
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
          className: "bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition sm:text-xl cursor-pointer",
          type: "button",
          disabled: isLoading || (subscriptionData == null ? void 0 : subscriptionData.success),
          onClick: () => {
            if (!(subscriptionData == null ? void 0 : subscriptionData.success)) {
              handlePayment();
            }
          },
          children: isLoading ? "Processing..." : `${(subscriptionData == null ? void 0 : subscriptionData.subscription_type) === "crypto" && (subscriptionData == null ? void 0 : subscriptionData.success) ? "ALL READY SUBSCRIBED" : "PAY NOW"}`
        }
      )
    ] })
  ] }) }) }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CryptoSubscription
}, Symbol.toStringTag, { value: "Module" }));
function PaymentSuccess() {
  return /* @__PURE__ */ jsxs("section", { className: "min-h-screen flex flex-col justify-center items-center bg-green-50 p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-green-600 mb-4", children: "✅ Payment Successful" }),
    /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-green-800 max-w-md text-center", children: "Thank you for your purchase!" })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PaymentSuccess
}, Symbol.toStringTag, { value: "Module" }));
function PaymentCancel() {
  return /* @__PURE__ */ jsxs("section", { className: "min-h-screen flex flex-col justify-center items-center bg-red-50 p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-red-600 mb-4", children: "❌ Payment Cancelled" }),
    /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-red-800 max-w-md text-center", children: "Your payment was not completed. Please try again or contact support." })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PaymentCancel
}, Symbol.toStringTag, { value: "Module" }));
function PrivacyPolicy() {
  return /* @__PURE__ */ jsx("section", { className: "pt-[3.75rem] pb-10", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx(
      "h1",
      {
        className: "text-[1.675rem] font-semibold leading-[1.4] text-title mb-5 md:text-[2.5rem]",
        children: "Privacy Policy"
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Last Updated:" }),
      " 01.03.2025"
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "1. Introduction"
      }
    ),
    /* @__PURE__ */ jsxs("p", { children: [
      "Welcome to Team",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "WaqarZaka!" }),
      " Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our Web3 education platform. By using our services, you agree to the terms outlined in this policy."
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "2. Information We Collect"
      }
    ),
    /* @__PURE__ */ jsxs("p", { children: [
      "When you sign up on",
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[#0d6efd] font-bold",
          to: "/",
          children: "WaqarZaka.net"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-5", children: [
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Personal Information" }),
        " : Name, email address, gender, date of birth, country, and WhatsApp number."
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Login Credentials" }),
        ": Passwords (encrypted and secured)."
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Usage Data" }),
        ": IP address, browser type, and access logs for security purposes."
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "3. How We Use Your Information"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "We use the collected data for the following purposes:" }),
    /* @__PURE__ */ jsx("p", { children: "✔ To provide secure account access." }),
    /* @__PURE__ */ jsx("p", { children: "✔ To enhance your user experience." }),
    /* @__PURE__ */ jsx("p", { children: "✔ To communicate important updates & announcements." }),
    /* @__PURE__ */ jsx("p", { children: "✔ To send marketing emails and feature updates (you can opt out anytime)." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "✔ To ensure compliance with our Terms & Conditions." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "4. Data Protection & Security"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "We take strict measures to protect your data:" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-5", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "All passwords are encrypted." }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Sensitive information is stored with secure encryption methods." }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: "Regular security audits are performed to prevent data breaches." })
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "5. No Data Sharing with Third Parties"
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mb-5", children: [
      "We ",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "DO NOT" }),
      " sell, rent, or share your data with any",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "third-party organizations" }),
      " . Your personal information remains strictly confidential and is used only for internal purposes related to our platform."
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "6. User Rights & Control"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "You have full control over your data:" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-5", children: [
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Unsubscribe" }),
        ": You can opt out of marketing emails anytime."
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "py-[0.313rem]", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Delete Account" }),
        ": You may request account deletion by contacting our support team."
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "7. Cookies & Tracking"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "To improve user experience, we may use cookies for:" }),
    /* @__PURE__ */ jsx("p", { children: "Enhancing website performance." }),
    /* @__PURE__ */ jsx("p", { children: "Analyzing visitor trends and platform activity." }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: "Securing login sessions." }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "Users can disable cookies in their browser settings if they prefer." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "8. Legal Compliance"
      }
    ),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      "We comply with global",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "data protection laws" }),
      ", including:"
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-8 text-[#858796] mb-4", children: [
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: /* @__PURE__ */ jsx(
        "span",
        {
          className: "font-bold",
          children: "UK’s GDPR (General Data Protection Regulation)"
        }
      ) }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: /* @__PURE__ */ jsx("span", { className: "font-bold", children: "US Data Protection Laws" }) }),
      /* @__PURE__ */ jsx("li", { className: "py-[0.313rem]", children: /* @__PURE__ */ jsx(
        "span",
        {
          className: "font-bold",
          children: "Pakistan’s PECA (Prevention of Electronic Crimes Act, 2016)"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "If required by law enforcement, we may disclose user data in compliance with legal requests." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "9. Changes to Privacy Policy"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mb-5", children: "We may update this Privacy Policy periodically. Users will be notified of any major changes. Continued use of the platform constitutes acceptance of the updated policy." }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-2xl text-left text-title font-semibold leading-[1.4] mb-5 md:text-[2rem]",
        children: "10. Contact Us"
      }
    ),
    /* @__PURE__ */ jsx("p", { children: "For any privacy-related concerns or questions, reach out to:" }),
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Email:" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[#0d6efd] ml-1",
          to: "/",
          children: "support@waqarzaka.net"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Website:" }),
      /* @__PURE__ */ jsx(Link, { className: "text-[#0d6efd] ml-1", to: "/", children: "https://waqarzaka.net" })
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      "By using our platform, you acknowledge and accept our",
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Privacy Policy" }),
      "."
    ] })
  ] }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyPolicy
}, Symbol.toStringTag, { value: "Module" }));
function Subscription() {
  var _a;
  const auth = useSelector((state) => state.auth);
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, { refetchOnMountOrArgChange: true });
  const [createCheckoutSession, { isLoading }] = useCreateCryptoCheckoutSessionMutation();
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
  console.log("subscriptionData", subscriptionData);
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
          className: "bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition sm:text-xl cursor-pointer",
          type: "button",
          disabled: isLoading || (subscriptionData == null ? void 0 : subscriptionData.success),
          onClick: () => {
            if (!(subscriptionData == null ? void 0 : subscriptionData.success)) {
              handlePayment();
            }
          },
          children: isLoading ? "Processing..." : `${(subscriptionData == null ? void 0 : subscriptionData.subscription_type) === "crypto" && (subscriptionData == null ? void 0 : subscriptionData.success) ? "ALL READY SUBSCRIBED" : "PAY NOW"}`
        }
      )
    ] })
  ] }) }) }) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Subscription
}, Symbol.toStringTag, { value: "Module" }));
const BU = "/assets/%E0%A6%B8%E0%A6%AB%E0%A6%B2-Amazon-%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%AC%E0%A6%B8%E0%A6%BE%E0%A6%B0-%E0%A6%B8%E0%A6%BF%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%9F-DPndnSlB.jpg";
const LEFTIMG = "/assets/Lets-Grow-Together-B6CbRj7l.png";
const ULT = "/assets/Untitled-design-47-BGHkhlWw.png";
function Ecommerce() {
  const { data: ecommerceService } = useGetEcommerceServiceQuery(void 0, { refetchOnMountOrArgChange: true });
  const [createCheckoutSession, { isLoading }] = useCreateEcommerceCheckoutSessionMutation();
  const handleEcommercePaymnet = async () => {
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
  return /* @__PURE__ */ jsxs("main", { className: "bg-[#f6f6f6] pb-10", children: [
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { className: "rounded-lg", src: BU, alt: "" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-[#00A217] text-xl lg:leading-[1.1] lg:text-5xl text-center font-semibold", children: "আমি আপনাকে শিখবো, কিভাবে অ্যামাজনে সফল ব্যবসা প্রতিষ্ঠা করতে পারেন |" }),
      /* @__PURE__ */ jsx("div", { className: "border-8 border-[#FFBD00] rounded-3xl shadow-[0_0_10px_0_rgba(0,0,0,0.5)] overflow-hidden h-80 lg:h-screen", children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-full",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "আমাদের কেন Amazon এ Sell করা উচিত | WHY WE SHOULD SELL IN AMAZON IN 2024",
          width: "640",
          src: "https://www.youtube.com/embed/T2fjNkbcJ2w?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=1&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExaTRMaUltQnl6RGY1WHZoNwEee468PaLPLhhWu0YrsX9lRoVXSKi4hBTOh3XaffZ0dhI3e9n7JChLARnGgwQ_aem_5kr89GyR283R-pshVNpROA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget2",
          "data-gtm-yt-inspected-12": "true"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-[#0D203B] text-xl lg:leading-[1.1] lg:text-5xl font-semibold bg-[#E5F0FF] p-2.5 rounded-3xl", children: "সফল Amazon ব্যবসা করার জন্য যা যা জানা উচিৎ" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 512 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-xl", children: "সঠিক প্রোডাক্ট সিলেক্ট করা" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 512 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "ব্যবসার প্ল্যান ও গোল তৈরি করা" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 512 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "ব্যবসার আইডিয়া বের করা" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 512 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "প্রোডাক্ট সৌরচিং আইডিয়া থাকা" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { className: "rounded-lg", src: LEFTIMG, alt: "" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-[#025A80] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold bg-[#E5F0FF] p-2.5 rounded-3xl", children: 'এই "COURSE" থেকে যা যা শিখতে পারবেন' }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "আইডিয়া" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "মার্কেট রিসার্চ করে প্ৰডাক্ট এর আইডিয়া বের করা" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "উইনিং প্রোডাক্ট" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Amazon এর জন্য উইনিং প্রোডাক্ট খুঁজে বের করা" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "রিসার্চ" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "মার্কেট রিসার্চ করে প্ৰডাক্ট এর আইডিয়া বের করা" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "মার্কেটিং" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "সঠিক পদ্ধতিতে Amazon এর মার্কেটিং করা" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "FBA/FBM" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "FBA/FBMএর প্রক্রিয়া সম্পর্কে ভালোভাবে জানা" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "LTD/LLC" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "US LLC এবং UK LTD কি?" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-5 lg:space-y-7 text-center", children: /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Authorized Distributors for Private Label and Brand Approval" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Products Listing" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "কিভাবে আপনার product listing করবেন" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Keyword Research" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "কিভাবে Keyword research করবেন" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Worldwide Selling" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "কীভাবে বিশ্বব্যাপী পণ্য বিক্রি করবেন" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Own Branding" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "কিভাবে আপনার নিজের ব্র্যান্ড চালু করবেন" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-5 lg:space-y-7 text-center", children: /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Amazon Trademark Registration & Brand Registry" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Amazon Trademark Registration & Brand Registry" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "কিভাবে Amazon PPC ক্যাম্পেইন চালাবেন" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-5 lg:space-y-7 text-center", children: /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "ADS কিভাবে Facebook এবং Instagram AD চালাবেন" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-5 lg:space-y-7 text-center", children: /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Tiktok Ad কিভাবে Amazon এর জন্য TikTok এ AD চালাবেন" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Dropshipping" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "কিভাবে Dropshipping করবেন" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Invoice" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Amazon Invoice Requirements for Brand" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-5 lg:space-y-7 text-center", children: /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Noon, ETSY, Walmart, Shopify and Woo ommers" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Airbnb" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "How to Start Airbnb" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-5 lg:space-y-7 text-center", children: /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Problem solving and business idea Individual and Corporate sales" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Free Lifetime Support" }),
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: "Free Lifetime support থাকবে" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: /* @__PURE__ */ jsx("h2", { className: "text-[#0D203B] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold p-2.5 rounded-2xl border-4 border-[#E41515]", children: "বিগত সময়ে আমার কোর্সে অংশগ্রহণ করার পর স্টুডেন্টদের ফিডব্যাক" }) }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-5 items-center flex-nowrap", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-96", children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "w-full h-full",
            src: ULT,
            alt: ""
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "w-full bg-[#3B3C3D]", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-white text-center p-2.5", children: "Book a free call now to discover the Amazon course" }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              action: "",
              className: "bg-[#BCC701] p-2.5 flex flex-col gap-2.5",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "rounded-none border border-[#5F5F5F] p-2.5 text-black",
                    type: "text",
                    placeholder: "Name"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "rounded-none border border-[#5F5F5F] p-2.5 text-black",
                    type: "text",
                    placeholder: "What'sApp number"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "rounded-none border border-[#5F5F5F] p-2.5 text-black",
                    type: "text",
                    placeholder: "Country Name"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "rounded-none border border-[#5F5F5F] p-2.5 text-black",
                    type: "text",
                    placeholder: "Message"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "p-2.5 rounded-none text-xl font-medium bg-[#3B3C3D]! text-white!",
                    type: "submit",
                    children: "Send"
                  }
                )
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-5 items-center flex-nowrap", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("h2", { className: "text-[#0D203B] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold", children: "Click to send WhatsApp message" }) }),
        /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: "size-36 rounded-2xl flex items-center justify-center bg-[#25d366] transform hover:scale-[0.8] transition duration-300",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-16 fill-white",
                viewBox: "0 0 448 512",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx("path", { d: "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" })
              }
            )
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "3,24000 AED SALE - Jahidul form Al ain worked in Cafe shop befor| g #sell #automobile #shelby #",
          src: "https://www.youtube.com/embed/sg2fiRGZQ6c?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=3&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExaTRMaUltQnl6RGY1WHZoNwEee468PaLPLhhWu0YrsX9lRoVXSKi4hBTOh3XaffZ0dhI3e9n7JChLARnGgwQ_aem_5kr89GyR283R-pshVNpROA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget4",
          "data-gtm-yt-inspected-12": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "4200 AED SALE CLINET FROM SHARJHA | sales in 1 month",
          src: "https://www.youtube.com/embed/shEwvlhmvnU?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=5&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget6",
          "data-gtm-yt-inspected-9": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "1 Millions 10000 AED SALES ON 6 month from noon and amaozn | Amazon sales -noon sales",
          src: "https://www.youtube.com/embed/hlhPIEOs61o?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=7&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget8",
          "data-gtm-yt-inspected-9": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "কিভাবে amazon থেকে মিলিয়ন ডলার আয় করা যায় এবং | আমি কিভাবে সাহায্য করতে পারি",
          src: "https://www.youtube.com/embed/iSjnSIvppIw?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=9&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget10",
          "data-gtm-yt-inspected-9": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "কিভাবে AMAZION থেকে মিলিয়ন ডলার আয় করা যায় ?",
          src: "https://www.youtube.com/embed/T2FMXBakpYc?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=13&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget14",
          "data-gtm-yt-inspected-9": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "Avoid Mistakes: Order Removal Process On Amazon | অ্যামাজন সেলার সেন্ট্রালে কীভাবে Order বাদ দেবেন |",
          src: "https://www.youtube.com/embed/8Ou0xO4dx-k?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=17&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget18",
          "data-gtm-yt-inspected-9": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "কিভাবে আপনি বিশ্বের যে কোন জায়গা and Bangladesh থেকে Amazon এ বিক্রি করে অর্থ উপার্জন করতে পারেন |",
          src: "https://www.youtube.com/embed/V_7uVAvA4b8?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=11&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget12",
          "data-gtm-yt-inspected-9": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "Amazon and e-commerce in Dubai | SELINA RAHMAN VLOGS",
          src: "https://www.youtube.com/embed/WmMv1eC4dgM?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=15&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget16",
          "data-gtm-yt-inspected-9": "true"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "w-full h-60",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          title: "Unlock Amazon Selling in Dubai, UAE, KSA, Singapore, Qatar, and More!",
          src: "https://www.youtube.com/embed/yBYdRBGlTS8?controls=1&rel=0&playsinline=0&modestbranding=0&autoplay=0&enablejsapi=1&origin=https%3A%2F%2Fbjollys.com&widgetid=19&forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&aoriginsup=1&gporigin=https%3A%2F%2Fwww.facebook.com%2F&vf=1",
          id: "widget20",
          "data-gtm-yt-inspected-9": "true"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 xl:grid-cols-3 gap-x-2.5 gap-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-4xl xl:text-6xl font-semibold text-[#777]", children: [
          "1,500 ",
          /* @__PURE__ */ jsx("span", { children: "+" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "underline text-base xl:text-2xl font-normal text-[#777]", children: "Clients" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-4xl xl:text-6xl font-semibold text-[#777] text-nowrap", children: [
          "$ 10,000,000",
          /* @__PURE__ */ jsx("span", { children: "+" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "underline text-base xl:text-2xl font-normal text-[#777]", children: "Revenue generated" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-4xl xl:text-6xl font-semibold text-[#777]", children: [
          "500",
          /* @__PURE__ */ jsx("span", { children: "+" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "underline text-base xl:text-2xl font-normal text-[#777]", children: "Companies" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-[#242424] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold", children: "প্রশ্ন এবং উত্তর" }),
      /* @__PURE__ */ jsxs("div", { className: "", children: [
        /* @__PURE__ */ jsxs("details", { className: "border-b border-gray-200 p-4", children: [
          /* @__PURE__ */ jsxs("summary", { className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer", children: [
            "কোর্সগুলোর সাথে সাপোর্ট পাবো কিভাবে?",
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5 transform transition-transform duration-200",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 9l-7 7-7-7"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "সাপোর্টের জন্য মূলত আমাদের একটি গ্রুপ থাকবে, আমার সাপোর্ট টিম থাকবে এবং আপনাদের সমস্যা নিয়ে আমি নিজেই মাঝে মাঝে জুম মিটিংয়ের মাধ্যমে সমাধান করবো ইনশাআল্লাহ্‌" }) })
        ] }),
        /* @__PURE__ */ jsxs("details", { className: "border-b border-gray-200 p-4", children: [
          /* @__PURE__ */ jsxs("summary", { className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer", children: [
            "কোর্সগুলো শেষ করতে কতদিন লাগবে?",
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5 transform transition-transform duration-200",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 9l-7 7-7-7"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "15 working days" }) })
        ] }),
        /* @__PURE__ */ jsxs("details", { className: "border-b border-gray-200 p-4", children: [
          /* @__PURE__ */ jsxs("summary", { className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer", children: [
            "1 by 1 course কি থাকবে ?",
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5 transform transition-transform duration-200",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M19 9l-7 7-7-7"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "Unlimited class with flexible time until sales happen" }) })
        ] }),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "Full course এর সাথে কি products থাকবে ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "Budget অনুযায়ী Products সরবারহ, 3pl service with guarantee sales only with amazon FBA" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "MPL and PL করতে budget কত লাগবে ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "1500 dollar for MPL and 3500 to 5000 dollar for PL." })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "কত budget হলে FBA business শুরু করা যায় ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "সর্বনিম্ন 500 dollar লাগবে" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "class video কি দেওয়া থাকবে ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "Course শেষ হবার পর সব vidoe দেওয়া হবে ?" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "Online course কি এবং weekly কয়দিন হবে ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "One and half hour to two hours and 3 to 4 class in week" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "Product add করার কতদিন পর থেকে sale শুরু হবে ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "যদি আমরা PPC করি তাহলে 7 থেকে ২১ দিনের মধ্যে sale শুরু হবে." })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "Noon এবং Amazon এ কি একসাথে business করতে পারবে ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "UAE এর E-commerce বা LLC license থাকলে Noon, Amazon এর সাথে ১৫ টা platform এ business করতে পারবে" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "details",
          {
            className: "border-b border-gray-200 p-4",
            children: [
              /* @__PURE__ */ jsxs(
                "summary",
                {
                  className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer",
                  children: [
                    "আপনি কি Bangladesh থেকে করতে পারবেন ?",
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5 transform transition-transform duration-200",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M19 9l-7 7-7-7"
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-4",
                  children: /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-black", children: "আপনার I’D, bank account & Debit card থাকলে আপনি পৃথিবীর ২০০ টি দেশ থেকে Amazon, Dropshipping এবং E-commerce করতে পারবেন." })
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 flex items-center justify-center", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "bg-[#021A6B] font-medium text-2xl lg:text-3xl rounded-full px-10 py-5 text-white cursor-pointer",
          onClick: handleEcommercePaymnet,
          children: "কোর্সে জয়েন করুন"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-8 lg:py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5 md:gap-y-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-[#025A80] text-2xl lg:text-5xl font-semibold bg-[#E5F0FF] px-5 py-3 rounded-3xl text-center", children: "Service Section" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5", children: ecommerceService == null ? void 0 : ecommerceService.map((item) => {
        return /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-2.5 lg:p-4 flex flex-col items-center gap-4 cursor-pointer", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: `${MEDIA_URL}${item.image}`, alt: item.title, className: "w-full h-auto rounded-full object-cover hover:scale-105 transition-transform duration-300" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2 grow flex flex-col items-center justify-end", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#6EC1E4] font-medium text-xl lg:text-2xl", children: item.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-[#6EC1E4] text-sm lg:text-base", children: [
              "Price : ",
              item.price,
              "$"
            ] })
          ] })
        ] }, item.id);
      }) })
    ] }) })
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ecommerce
}, Symbol.toStringTag, { value: "Module" }));
dayjs.extend(relativeTime);
const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState("crypto");
  const [eduLevel, setEduLevel] = useState("beginner");
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: cryptoTrades } = useGetCryptoTradesQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: stockCommoditiesTrades } = useGetStockCommoditiesTradesQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: marketUpdates } = useGetMarketUpdatesQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: education } = useGetEducationQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: ecommerceVideo } = useGetEcommerceVideoQuery(void 0, { refetchOnMountOrArgChange: true });
  const tabButtonClass = (tab) => `text-white text-sm md:text-base py-[0.219rem] px-3 rounded-[1.563rem] font-jost font-medium cursor-pointer text-center transition-all duration-150 ease-in-out ${activeTab === tab ? "bg-linear-[90deg,#384ef4,#b060ed]" : "hover:bg-linear-[90deg,#384ef4,#b060ed]"}`;
  const filterButtonClass = (level) => `p-1.5 rounded-[1.563rem] min-w-[6.75rem] cursor-pointer text-sm md:text-base font-medium ${eduLevel === level ? "bg-black text-white" : "bg-transparent text-black"}`;
  const filteredEducation = education == null ? void 0 : education.filter((item) => item.status === eduLevel);
  return /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto", children: [
    (subscriptionData == null ? void 0 : subscriptionData.subscription_type) === "crypto" && (subscriptionData == null ? void 0 : subscriptionData.success) && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative", children: [
      /* @__PURE__ */ jsxs("ul", { className: "flex flex-col sm:flex-row flex-wrap items-center w-full lg:w-fit mx-auto bg-section-title rounded-[1.625rem] p-[0.438rem]", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab("crypto"), className: tabButtonClass("crypto"), children: "Crypto Trades" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab("stock"), className: tabButtonClass("stock"), children: "Stock & Commodities Trades" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab("market"), className: tabButtonClass("market"), children: "Market Updates" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab("education"), className: tabButtonClass("education"), children: "Education" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6", children: [
        activeTab === "crypto" && (cryptoTrades == null ? void 0 : cryptoTrades.map((item) => /* @__PURE__ */ jsx(CardItem, { item }, item.id))),
        activeTab === "stock" && (stockCommoditiesTrades == null ? void 0 : stockCommoditiesTrades.map((item) => /* @__PURE__ */ jsx(CardItem, { item }, item.id))),
        activeTab === "market" && (marketUpdates == null ? void 0 : marketUpdates.map((item) => /* @__PURE__ */ jsx(CardItem, { item }, item.id))),
        activeTab === "education" && /* @__PURE__ */ jsxs("div", { className: "my-5 p-2.5 rounded-2xl bg-[#f1f3f4] w-full col-span-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-[#dadfe2] rounded-[1.563rem] p-[0.438rem] flex items-center justify-center w-fit mx-auto mb-5", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setEduLevel("beginner"), className: filterButtonClass("beginner"), children: "Beginner" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setEduLevel("advance"), className: filterButtonClass("advance"), children: "Advance" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: filteredEducation == null ? void 0 : filteredEducation.map((item) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "pt-6 px-4 pb-1.5 bg-[#dadfe2] rounded-2xl relative max-w-[80%] mx-auto",
              children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx("video", { className: "w-full h-auto rounded", src: `${MEDIA_URL}${item.video}`, controls: true }) })
            },
            item.id
          )) })
        ] })
      ] })
    ] }),
    (subscriptionData == null ? void 0 : subscriptionData.subscription_type) === "e-commerce" && (subscriptionData == null ? void 0 : subscriptionData.success) && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative", children: [
      /* @__PURE__ */ jsx("h2", { children: "E-commerce Videos" }),
      /* @__PURE__ */ jsx("div", { className: "my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6", children: ecommerceVideo == null ? void 0 : ecommerceVideo.map((item) => /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "pt-6 px-4 pb-1.5 bg-[#dadfe2] rounded-2xl relative w-full",
          children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx("video", { className: "w-full h-auto rounded", src: `${MEDIA_URL}${item.video}`, controls: true }) })
        }
      ) }, item.id)) })
    ] })
  ] }) }) });
};
const CardItem = ({ item }) => {
  var _a;
  return /* @__PURE__ */ jsxs("div", { className: "py-5 px-4 pt-10 bg-[#f5f5f5] relative", children: [
    /* @__PURE__ */ jsx("hr", { className: "border-t-[#c8c8c8] mb-2.5" }),
    item.image && /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx("img", { className: "w-full h-auto rounded", src: `${MEDIA_URL}${item.image}`, alt: item.title }) }),
    item.video && /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx("video", { className: "w-full h-auto rounded", src: `${MEDIA_URL}${item.video}`, controls: true }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-1 space-y-1.5 mt-1.5", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: item.title }),
      (_a = item.sub_titles) == null ? void 0 : _a.map((sub) => /* @__PURE__ */ jsx("p", { children: sub.sub_title }, sub.id)),
      /* @__PURE__ */ jsx("p", { children: item.description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-5", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[#0000005e]", children: dayjs(item.created_at).fromNow() }) })
  ] });
};
function Dashboard() {
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx(Fragment, { children: (subscriptionData == null ? void 0 : subscriptionData.success) ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(MainDashboard, {}) }) : /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative", children: /* @__PURE__ */ jsx("p", { className: "text-xl md:text-3xl font-bold uppercase text-center py-5", children: "This feature is only available for paid users." }) }) }) }) }) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
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
  const [addRegister, { isLoading }] = useAddRegisterMutation();
  const [isShow, setIsShow] = useState({
    password: false,
    confirm_password: false
  });
  const [hovered, setHovered] = useState(false);
  const [publicIp, setPublicIp] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { IoMdEyeOff: IoMdEyeOff2, IoEye: IoEye2 } = ReactIcons;
  useEffect(() => {
    fetch("https://api.ipify.org?format=json").then((res) => res.json()).then((data) => setPublicIp(data.ip)).catch(() => setPublicIp(""));
  }, []);
  const togglePasswordVisibility = (field) => {
    setIsShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const onSubmitForm = async (formData) => {
    try {
      const dataWithIp = { ...formData, local_ip: publicIp || void 0 };
      await addRegister(dataWithIp).unwrap();
      toast.success("Registered successfully!");
      reset();
      navigate("/login/");
    } catch (err) {
      toast.error("Something went wrong during registration.");
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
            disabled: isLoading,
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
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const About = () => {
  var _a, _b, _c;
  const { data } = useGetAboutQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", id: "about", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "py-[1.563rem] px-[0.938rem] sm:p-[3.125rem] rounded-[1.125rem] text-white  bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-white mb-5", children: "About" }),
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
      /* @__PURE__ */ jsx("div", { className: "lg:w-[41.66%] lg:pl-3", children: /* @__PURE__ */ jsx("img", { className: "w-full h-full rounded", src: `${MEDIA_URL}${(_c = data == null ? void 0 : data.data) == null ? void 0 : _c.image}`, alt: "" }) })
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
  return /* @__PURE__ */ jsx("section", { className: "py-5 lg:py-12 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "uppercase text-purple text-2xl font-semibold", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.sub_title }),
      /* @__PURE__ */ jsx("h1", { className: "mb-5 text-purple text-4xl lg:text-6xl font-bold mt-2.5", children: (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.title }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-4 text-body-color", children: /* @__PURE__ */ jsx("p", { className: "text-justify", children: (_c = data == null ? void 0 : data.data) == null ? void 0 : _c.description }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsx("button", { className: "text-purple underline cursor-pointer", type: "button", onClick: handleOpen, children: "See More" }) }),
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
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", id: "services", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-10 w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center text-center w-full", children: /* @__PURE__ */ jsxs("h2", { className: "flex flex-col mb-10", children: [
      "Explore our ",
      /* @__PURE__ */ jsx("span", { className: "text-purple", children: " education services" })
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
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap items-center justify-center w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full", children: /* @__PURE__ */ jsxs("h2", { className: "flex flex-col", children: [
      "Team ",
      /* @__PURE__ */ jsx("span", { className: "text-purple", children: " Acknowledgements" })
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
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.map((item) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "pt-12 px-5 pb-[1.875rem] flex flex-col gap-5 bg-cover bg-no-repeat bg-center rounded lg:rounded-2xl",
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
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const LoginForm = () => {
  const [addLogin, { isLoading }] = useAddLoginMutation();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [publicIp, setPublicIp] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { IoEye: IoEye2, IoMdEyeOff: IoMdEyeOff2 } = ReactIcons;
  useEffect(() => {
    fetch("https://api.ipify.org?format=json").then((res) => res.json()).then((data) => setPublicIp(data.ip)).catch(() => setPublicIp(""));
  }, []);
  const onSubmitForm = async (formData) => {
    try {
      const dataWithIp = { ...formData, local_ip: publicIp || void 0 };
      await addLogin(dataWithIp).unwrap();
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
      /* @__PURE__ */ jsx(Link, { className: "text-blue-600 underline", to: "/register/", children: "Create New Account?" }),
      /* @__PURE__ */ jsx(Link, { className: "text-blue-600 underline", to: "/", children: "Forget Password?" })
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
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CRDHeoIx.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/components-DvU-JqrC.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-L8wVqTFa.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/components-DvU-JqrC.js", "/assets/index-CHqNmqgh.js", "/assets/apiSlice-CCpCTW3O.js", "/assets/popupSlice-spuH2mZ-.js", "/assets/configurationApi-DtjFL0LI.js", "/assets/reactIcons-Dmpet-QG.js"], "css": ["/assets/root-DS6YTze3.css"] }, "routes/terms-and-conditions": { "id": "routes/terms-and-conditions", "parentId": "root", "path": "terms-and-conditions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/terms-and-conditions-B7m7bkPP.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DvU-JqrC.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/crypto.subscription": { "id": "routes/crypto.subscription", "parentId": "root", "path": "crypto/subscription", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/crypto.subscription-PoChGFMq.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/apiSlice-CCpCTW3O.js", "/assets/paymentsApi-Clj1HOdJ.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/payment.success": { "id": "routes/payment.success", "parentId": "root", "path": "payment/success", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/payment.success--G2xjUV6.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/payment.cancel": { "id": "routes/payment.cancel", "parentId": "root", "path": "payment/cancel", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/payment.cancel-C6rcxKCP.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/privacy-policy": { "id": "routes/privacy-policy", "parentId": "root", "path": "privacy-policy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/privacy-policy-Cru2qgQw.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DvU-JqrC.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/subscription": { "id": "routes/subscription", "parentId": "root", "path": "subscription", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/subscription-DXtbWS_p.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/apiSlice-CCpCTW3O.js", "/assets/paymentsApi-Clj1HOdJ.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/e-commerce": { "id": "routes/e-commerce", "parentId": "root", "path": "e-commerce", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/e-commerce-wLxgi9rS.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/configurationApi-DtjFL0LI.js", "/assets/apiSlice-CCpCTW3O.js", "/assets/paymentsApi-Clj1HOdJ.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-CjnVgGss.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/configurationApi-DtjFL0LI.js", "/assets/apiSlice-CCpCTW3O.js", "/assets/paymentsApi-Clj1HOdJ.js"], "css": [] }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/register-B4bO5TXM.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/authApi-q3ZIXJfh.js", "/assets/reactIcons-Dmpet-QG.js", "/assets/index-CHqNmqgh.js", "/assets/components-DvU-JqrC.js", "/assets/apiSlice-CCpCTW3O.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BEYOLcfU.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/configurationApi-DtjFL0LI.js", "/assets/apiSlice-CCpCTW3O.js", "/assets/popupSlice-spuH2mZ-.js", "/assets/reactIcons-Dmpet-QG.js", "/assets/components-DvU-JqrC.js", "/assets/index-BJYSoprK.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-B_F-4RSi.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-BJYSoprK.js", "/assets/authApi-q3ZIXJfh.js", "/assets/reactIcons-Dmpet-QG.js", "/assets/index-CHqNmqgh.js", "/assets/components-DvU-JqrC.js", "/assets/apiSlice-CCpCTW3O.js"], "css": [] } }, "url": "/assets/manifest-2caa99ac.js", "version": "2caa99ac" };
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
  "routes/terms-and-conditions": {
    id: "routes/terms-and-conditions",
    parentId: "root",
    path: "terms-and-conditions",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/crypto.subscription": {
    id: "routes/crypto.subscription",
    parentId: "root",
    path: "crypto/subscription",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/payment.success": {
    id: "routes/payment.success",
    parentId: "root",
    path: "payment/success",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/payment.cancel": {
    id: "routes/payment.cancel",
    parentId: "root",
    path: "payment/cancel",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/privacy-policy": {
    id: "routes/privacy-policy",
    parentId: "root",
    path: "privacy-policy",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/subscription": {
    id: "routes/subscription",
    parentId: "root",
    path: "subscription",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/e-commerce": {
    id: "routes/e-commerce",
    parentId: "root",
    path: "e-commerce",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route10
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route11
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
