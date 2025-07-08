import { Link } from "@remix-run/react";
import React from "react"
import { useDispatch } from "react-redux";
import { useGetBannerQuery } from "~/redux/features/configuration/configurationApi";
import { openSeeMore } from "~/redux/features/popup/popupSlice";
import { MEDIA_URL } from "~/utils/api";
import { ReactIcons } from "~/utils/reactIcons";

export const Banner: React.FC = () => {
    const { data } = useGetBannerQuery(undefined, { refetchOnMountOrArgChange: true });
    const { MdArrowRightAlt, FaFacebook } = ReactIcons;
    const dispatch = useDispatch();
    const handleOpen = () => {
        dispatch(openSeeMore());
    };
    return (
        <section className="relative top-0 left-0 right-0 py-5 lg:py-12 w-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center w-full">
                    <div className="flex flex-col flex-wrap w-full">

                        <h3 className="uppercase text-purple text-2xl font-semibold">{data?.data?.sub_title}</h3>

                        <h1 className="mb-5 text-purple text-4xl lg:text-6xl font-bold mt-2.5">{data?.data?.title}</h1>

                        <div className="space-y-4 mb-4 text-body-color">
                            <p className="text-justify">{data?.data?.description}</p>
                        </div>

                        <div className="mb-5">
                            <button className="text-purple underline cursor-pointer" type="button" onClick={handleOpen}>See More</button>
                        </div>

                        <div className="flex gap-5 flex-wrap mb-10">
                            <Link className="p-2.5 px-4 text-center bg-[#2f8aff] rounded-[1.875rem] text-white uppercase flex items-center justify-center gap-2.5 text-[0.938rem] transition-all duration-[0.3s] ease-in transform hover:scale-[1.1] basis-full md:basis-auto"
                                to="/" >JOIN GODZILLA TRADING</Link>
                            <button
                                className="p-2.5 px-4 text-center bg-[#2f8aff] rounded-[1.875rem] text-white uppercase flex items-center justify-center gap-2.5 text-[0.938rem] transition-all duration-[0.3s] ease-in transform hover:scale-[1.1] basis-full md:basis-auto cursor-pointer"
                                id="annual-popup"
                            >
                                <FaFacebook className="text-xl" />
                                Annual Group
                            </button>
                        </div>
                        <div>
                            <button
                                className="flex items-center p-[0.313rem] border border-[#8c8888] rounded-[1.875rem] uppercase text-section-title cursor-pointer w-full"
                                type="button"
                            >
                                <span className="grow text-center"
                                >Explore Our Channels</span>
                                <div
                                    className="bg-[#636abc] size-10 rounded-full flex items-center justify-center shrink-0"
                                >
                                    <MdArrowRightAlt className="text-xl text-white" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col flex-wrap justify-center items-center w-full h-full">
                        <video
                            className="w-full h-auto rounded-2xl"
                            controls
                            src={`${MEDIA_URL}${data?.data?.video}`}
                        ></video>
                    </div>
                </div>
            </div>
        </section>
    );
}