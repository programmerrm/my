import React from "react";
import { useGetWhy_usQuery } from "~/redux/features/configuration/configurationApi";
import { MEDIA_URL } from "~/utils/api";

export const Why_Us:React.FC = () => {
    const { data } = useGetWhy_usQuery(undefined, { refetchOnMountOrArgChange: true });
    return (
        <section className="relative top-0 left-0 right-0 py-5 lg:py-16 w-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data?.data?.map((item: any) => {
                        return (
                            <div
                                className="pt-12 px-5 pb-[1.875rem] flex flex-col gap-5 bg-cover bg-no-repeat bg-center rounded-md"
                                style={{ backgroundImage: `url(${MEDIA_URL}${item.image})` }}
                            >
                                <div>
                                    <img src={`${MEDIA_URL}${item.sub_image}`} alt="" />
                                </div>
                                <div className="text-white">
                                    <h5 className="mb-2">{item.title}</h5>
                                    <p className="text-xs leading-normal">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
