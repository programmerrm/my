import { useSelector } from "react-redux";
import { useCreateCheckoutSessionMutation, useGetSubscriptionQuery } from "~/redux/features/payments/paymentsApi";
import { RootState } from "~/redux/store";

export default function CryptoSubscription() {
    const auth = useSelector((state: RootState) => state.auth);
        const { data: subscriptionData } = useGetSubscriptionQuery(undefined, { refetchOnMountOrArgChange: true });
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
    return (
        <section className="py-[4.375rem]">
            <div className="container">
                <div className="max-w-[62.5rem] mx-auto p-1 rounded-[1.25rem] bg-linear-[90deg,#384ef4,#b060ed]">
                    <div className="bg-white rounded-[1.125rem] py-5 px-[0.438rem] sm:p-10">
                        <h1 className="text-[1.75rem] leading-[1.2] font-semibold text-center text-title mb-[1.875rem] md:text-[2.188rem] md:mb-[2.813rem]">
                            WE ARE AN CRYPTO PLATFORM
                        </h1>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p>🔹 Get exclusive access to our current investments in crypto projects.</p>
                                <p>🔹 Track our portfolio performance and see what’s working.</p>
                            </div>
                            <div>
                                <p>🔍 Where We Are Going to Invest</p>
                                <p>🔹 Stay ahead with our future investment plans before anyone else.</p>
                                <p>🔹 Leverage our in-depth market analysis and research-backed decisions.</p>
                            </div>
                            <div>
                                <p>📊 What You Get:</p>
                                <p>✅ Insider insights into top crypto projects.</p>
                                <p>✅ Real-time investment strategies from experienced traders.</p>
                                <p>✅ Exclusive research reports on market trends and opportunities.</p>
                                <p>✅ Community discussions and expert opinions.</p>
                            </div>
                            <div>
                                <p>💳 Subscription Details: <span className="font-bold">10$ Monthly</span></p>
                                <p>🔁 Monthly Recurring Subscription – You’ll be charged automatically after <span className="font-bold">30 Days</span> completed.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <span>{auth?.user?.email}</span>
                            <button
                                className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition sm:text-xl cursor-pointer"
                                type="button"
                                disabled={isLoading || subscriptionData?.success}
                                onClick={() => {
                                    if (!subscriptionData?.success) {
                                        handlePayment();
                                    }
                                }}
                            >
                                {isLoading ? "Processing..." : `${subscriptionData?.success ? "ALL READY SUBSCRIBED" : "PAY NOW"}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}