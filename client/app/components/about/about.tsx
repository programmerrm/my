import React from "react";
import { useGetAboutQuery } from "~/redux/features/configuration/configurationApi";
import { MEDIA_URL } from "~/utils/api";

export const About: React.FC = () => {
    const { data } = useGetAboutQuery(undefined, { refetchOnMountOrArgChange: true });
    return (
        <section className="relative top-0 left-0 right-0 py-5 lg:py-12 w-full" id="about">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="py-[1.563rem] px-[0.938rem] sm:p-[3.125rem] rounded-[1.125rem] text-white  bg-gradient-to-r from-[#384ef4] to-[#b060ed]">
                    <h2 className="text-white mb-5">About</h2>
                    <div className="flex flex-col-reverse gap-6 lg:gap-0 lg:flex-row items-center">
                        <div className="lg:w-[58.33%] lg:pr-3">
                            <h5 className="mb-[1.875rem] text-[1.188rem] md:text-[1.438rem]">
                                {data?.data?.title}
                            </h5>
                            <p className="mb-10 text-[#ddd]">
                                {data?.data?.description}
                            </p>
                            <a className="min-w-[10.313rem] inline-block bg-section-title border-2 border-section-title rounded-[1.875rem] text-white py-2.5 px-5 text-center uppercase transition-all duration-[0.3s] hover:bg-white hover:border-white hover:text-section-title"
                                href="/login/"
                            >Enroll Now</a>
                        </div>
                        <div className="lg:w-[41.66%] lg:pl-3">
                            <img className="w-full h-full rounded" src={`${MEDIA_URL}${data?.data?.image}`} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
