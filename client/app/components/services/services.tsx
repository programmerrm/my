import React from "react";
import { useGetServiceQuery } from "~/redux/features/configuration/configurationApi";
import { MEDIA_URL } from "~/utils/api";

export const Services: React.FC = () => {
    const { data } = useGetServiceQuery(undefined, { refetchOnMountOrArgChange: true });
    return (
        <section className="relative top-0 left-0 right-0 py-5 lg:py-12 w-full" id="services">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap gap-10 w-full">
                    <div className="flex flex-col flex-wrap justify-center items-center text-center w-full">
                        <h2 className="flex flex-col mb-10">
                            Explore our <span className="text-purple"> education services</span>
                        </h2>
                    </div>
                    <div className="grid gap-[1.875rem] sm:grid-cols-2 lg:grid-cols-3">
                        {data?.data?.map((item: any) => {
                            return (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <img
                                            className="w-full max-w-full object-cover"
                                            src={`${MEDIA_URL}${item.image}`}
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-[#202020]">{item.title}</h4>
                                        <p className="text-[#6f6f6f]">{item.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
