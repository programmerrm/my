import { useState } from "react";
import {
    useGetCryptoTradesQuery,
    useGetEcommerceVideoQuery,
    useGetEducationQuery,
    useGetMarketUpdatesQuery,
    useGetStockCommoditiesTradesQuery,
} from "~/redux/features/configuration/configurationApi";
import { MEDIA_URL } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetSubscriptionQuery } from "~/redux/features/payments/paymentsApi";
dayjs.extend(relativeTime);

export const MainDashboard = () => {
    const [activeTab, setActiveTab] = useState<"crypto" | "stock" | "market" | "education">("crypto");
    const [eduLevel, setEduLevel] = useState<"beginner" | "advance">("beginner");

    const { data: subscriptionData } = useGetSubscriptionQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: cryptoTrades } = useGetCryptoTradesQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: stockCommoditiesTrades } = useGetStockCommoditiesTradesQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: marketUpdates } = useGetMarketUpdatesQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: education } = useGetEducationQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: ecommerceVideo } = useGetEcommerceVideoQuery(undefined, { refetchOnMountOrArgChange: true });

    const tabButtonClass = (tab: string) =>
        `text-white text-sm md:text-base py-[0.219rem] px-3 rounded-[1.563rem] font-jost font-medium cursor-pointer text-center transition-all duration-150 ease-in-out ${activeTab === tab ? "bg-linear-[90deg,#384ef4,#b060ed]" : "hover:bg-linear-[90deg,#384ef4,#b060ed]"
        }`;

    const filterButtonClass = (level: "beginner" | "advance") =>
        `p-1.5 rounded-[1.563rem] min-w-[6.75rem] cursor-pointer text-sm md:text-base font-medium ${eduLevel === level ? "bg-black text-white" : "bg-transparent text-black"
        }`;

    const filteredEducation = education?.filter((item: any) => item.status === eduLevel);

    return (
        <section className="py-[4.375rem]">
            <div className="container">
                <div className="bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto">
                    {subscriptionData?.subscription_type === 'crypto' && subscriptionData?.success && (
                        <div className="bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative">
                            <ul className="flex flex-col sm:flex-row flex-wrap items-center w-full lg:w-fit mx-auto bg-section-title rounded-[1.625rem] p-[0.438rem]">
                                <li><button onClick={() => setActiveTab("crypto")} className={tabButtonClass("crypto")}>Crypto Trades</button></li>
                                <li><button onClick={() => setActiveTab("stock")} className={tabButtonClass("stock")}>Stock & Commodities Trades</button></li>
                                <li><button onClick={() => setActiveTab("market")} className={tabButtonClass("market")}>Market Updates</button></li>
                                <li><button onClick={() => setActiveTab("education")} className={tabButtonClass("education")}>Education</button></li>
                            </ul>

                            <div className="my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
                                {activeTab === "crypto" && cryptoTrades?.map((item: any) => <CardItem key={item.id} item={item} />)}
                                {activeTab === "stock" && stockCommoditiesTrades?.map((item: any) => <CardItem key={item.id} item={item} />)}
                                {activeTab === "market" && marketUpdates?.map((item: any) => <CardItem key={item.id} item={item} />)}

                                {activeTab === "education" && (
                                    <div className="my-5 p-2.5 rounded-2xl bg-[#f1f3f4] w-full col-span-full">
                                        <div className="bg-[#dadfe2] rounded-[1.563rem] p-[0.438rem] flex items-center justify-center w-fit mx-auto mb-5">
                                            <button onClick={() => setEduLevel("beginner")} className={filterButtonClass("beginner")}>
                                                Beginner
                                            </button>
                                            <button onClick={() => setEduLevel("advance")} className={filterButtonClass("advance")}>
                                                Advance
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {filteredEducation?.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="pt-6 px-4 pb-1.5 bg-[#dadfe2] rounded-2xl relative max-w-[80%] mx-auto"
                                                >
                                                    <div className="flex flex-col flex-wrap w-full">
                                                        <video className="w-full h-auto rounded" src={`${MEDIA_URL}${item.video}`} controls />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {subscriptionData?.subscription_type === 'e-commerce' && subscriptionData?.success && (
                        <div className="bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative">
                            <h2>E-commerce Videos</h2>
                            <div className="my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
                                {ecommerceVideo?.map((item: any) => (
                                    <div className="space-y-2.5" key={item.id}>
                                        <div

                                            className="pt-6 px-4 pb-1.5 bg-[#dadfe2] rounded-2xl relative w-full"
                                        >
                                            <div className="flex flex-col flex-wrap w-full">
                                                <video className="w-full h-auto rounded" src={`${MEDIA_URL}${item.video}`} controls />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const CardItem = ({ item }: { item: any }) => (
    <div className="py-5 px-4 pt-10 bg-[#f5f5f5] relative">
        <hr className="border-t-[#c8c8c8] mb-2.5" />
        {item.image && (
            <div className="flex flex-col flex-wrap w-full">
                <img className="w-full h-auto rounded" src={`${MEDIA_URL}${item.image}`} alt={item.title} />
            </div>
        )}
        {item.video && (
            <div className="flex flex-col flex-wrap w-full">
                <video className="w-full h-auto rounded" src={`${MEDIA_URL}${item.video}`} controls />
            </div>
        )}
        <div className="px-1 space-y-1.5 mt-1.5">
            <p className="font-semibold">{item.title}</p>
            {item.sub_titles?.map((sub: any) => <p key={sub.id}>{sub.sub_title}</p>)}
            <p>{item.description}</p>
        </div>
        <div className="absolute bottom-2 right-5">
            <p className="text-xs text-[#0000005e]">{dayjs(item.created_at).fromNow()}</p>
        </div>
    </div>
);
