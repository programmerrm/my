import { Link } from "@remix-run/react";
import { ReactIcons } from "~/utils/reactIcons";
import { useGetFooterLogoQuery, useGetOfficialInfoQuery } from "~/redux/features/configuration/configurationApi";
import { MEDIA_URL } from "~/utils/api";
import { useDispatch } from "react-redux";
import { openFooterSeeMore } from "~/redux/features/popup/popupSlice";

export const Footer = () => {
    const { data: footerLogo } = useGetFooterLogoQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: officialInfo } = useGetOfficialInfoQuery(undefined, { refetchOnMountOrArgChange: true });
    const { RiFacebookCircleLine, FaInstagram, RiTwitterXFill, CiLinkedin } = ReactIcons;
    const dispatch = useDispatch();

    return (
        <footer className="relative top-0 left-0 right-0 py-5 lg:py-10 w-full text-white bg-gradient-to-r from-[#384ef4] to-[#b060ed]">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap w-full">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 w-full pb-5">
                        <div className="flex flex-col flex-wrap gap-y-5 w-full">
                            <Link className="block w-fit" to={'/'}>
                                <img className="w-24 sm:w-28 md:w-32 lg:w-40" src={`${MEDIA_URL}${footerLogo?.data?.logo}`} alt="bijolis" loading="lazy" decoding="async" />
                            </Link>
                            <p className="text-sm font-normal line-clamp-4">{footerLogo?.data?.description}</p>
                        </div>
                        <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full">
                            <h4 className="text-lg font-medium uppercase">Resources</h4>
                            <ul className="flex flex-col flex-wrap gap-y-1.5 lg:gap-y-2.5 w-full text-sm lg:text-base font-normal">
                                <li>
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById("about");
                                            if (el) el.scrollIntoView({ behavior: "smooth" });
                                        }}
                                        className="text-left cursor-pointer"
                                    >
                                        About
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById("services");
                                            if (el) el.scrollIntoView({ behavior: "smooth" });
                                        }}
                                        className="text-left cursor-pointer"
                                    >
                                        Services
                                    </button>
                                </li>
                                <li>
                                    <Link to={'/terms-and-conditions/'}>Terms & conditions</Link>
                                </li>
                                <li>
                                    <Link to={'/privacy-policy/'}>Privacy Policy</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full">
                            <h4 className="text-sm lg:text-lg font-medium uppercase">Official Info</h4>
                            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                                <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                                    <span className="text-sm lg:text-base font-normal">Address : </span>
                                    <span className="text-sm lg:text-base font-normal">{officialInfo?.data?.Address}</span>
                                </div>
                                <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                                    <span className="text-sm lg:text-base font-normal">Email : </span>
                                    <Link className="text-sm lg:text-base font-normal" to={`mailto:${officialInfo?.data?.email}`} target="_blank">{officialInfo?.data?.email}</Link>
                                </div>
                                <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                                    <span className="text-sm lg:text-base font-normal">Number : </span>
                                    <Link className="text-sm lg:text-base font-normal" to={`tel:${officialInfo?.data?.number}`} target="_blank">{officialInfo?.data?.number}</Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full">
                            <h4 className="text-sm lg:text-lg font-medium uppercase">social link</h4>
                            <div className="flex flex-row flex-wrap items-center gap-x-2.5 lg:gap-x-5">
                                <Link to={'/'}>
                                    <RiFacebookCircleLine className="text-xl lg:text-2xl" />
                                </Link>
                                <Link to={'/'}>
                                    <FaInstagram className="text-xl lg:text-2xl" />
                                </Link>
                                <Link to={'/'}>
                                    <RiTwitterXFill className="text-xl lg:text-2xl" />
                                </Link>
                                <Link to={'/'}>
                                    <CiLinkedin className="text-xl lg:text-2xl" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-wrap justify-center items-center py-5 w-full border-t border-b border-t-white border-b-white">
                        <p className="text-xs lg:text-sm font-normal text-center">Copyright © 2025 Waqar Zaka All Rights Reserved. Develop by <Link to={"https://dreamlabit.com/"} target="_blank">Dreamlabit</Link> Capital Media LLC</p>
                    </div>
                    <div className="flex flex-col flex-wrap justify-center items-center gap-y-2.5 lg:gap-y-5 py-5 w-full">
                        <div className="flex flex-col flex-wrap justify-center items-center gap-y-2.5">
                            <h4 className="text-sm lg:text-lg font-medium text-center">LEGAL DISCLAIMER & TERMS OF USE/CONDITIONS</h4>
                            <span className="text-sm lg:text-base font-normal">Last Updated: 20.03.2025</span>
                        </div>
                        <div className="flex flex-col flex-wrap items-center justify-center w-full lg:w-[65%]">
                            <p className="text-xs lg:text-sm font-normal text-justify lg:text-center">Welcome to www.waqarzaka.net (the "Website"). By accessing or using this Website, you agree to the following disclaimers, terms, and policies. If you do not agree with any part of this disclosure, please discontinue use immediately. <span className="underline cursor-pointer" onClick={() => dispatch(openFooterSeeMore())}>See More</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
