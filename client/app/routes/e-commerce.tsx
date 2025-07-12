import BU from "../assets/images/সফল-Amazon-ব্যবসার-সিক্রেট.jpg"
import LEFTIMG from "../assets/images/Lets-Grow-Together.png";
import ULT from "../assets/images/Untitled-design-47.png";
import { useGetEcommerceServiceQuery } from "~/redux/features/configuration/configurationApi";
import { MEDIA_URL } from "~/utils/api";
import { useCreateEcommerceCheckoutSessionMutation } from "~/redux/features/payments/paymentsApi";

export default function Ecommerce() {
    const { data: ecommerceService } = useGetEcommerceServiceQuery(undefined, { refetchOnMountOrArgChange: true });
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
    }
    return (
        <main className="bg-[#f6f6f6] pb-10">
            <section className="pt-10 lg:pt-10">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5">
                    <div>
                        <img className="rounded-lg" src={BU} alt="" />
                    </div>
                    <h1 className="text-[#00A217] text-xl lg:leading-[1.1] lg:text-5xl text-center font-semibold">আমি আপনাকে শিখবো, কিভাবে অ্যামাজনে সফল ব্যবসা প্রতিষ্ঠা করতে পারেন |</h1>
                    <div className="border-8 border-[#FFBD00] rounded-3xl shadow-[0_0_10px_0_rgba(0,0,0,0.5)] overflow-hidden h-80 lg:h-screen">
                        <iframe
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="আমাদের কেন Amazon এ Sell করা উচিত | WHY WE SHOULD SELL IN AMAZON IN 2024"
                            width="640"
                            src="https://www.youtube.com/embed/T2fjNkbcJ2w?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=1&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=1&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExaTRMaUltQnl6RGY1WHZoNwEee468PaLPLhhWu0YrsX9lRoVXSKi4hBTOh3XaffZ0dhI3e9n7JChLARnGgwQ_aem_5kr89GyR283R-pshVNpROA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget2"
                            data-gtm-yt-inspected-12="true"
                        ></iframe>
                    </div>
                </div>
            </section>

            <section className="pt-10 lg:pt-24">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
                    <h2 className="text-[#0D203B] text-xl lg:leading-[1.1] lg:text-5xl font-semibold bg-[#E5F0FF] p-2.5 rounded-3xl">সফল Amazon ব্যবসা করার জন্য যা যা জানা উচিৎ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 512 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-xl">সঠিক প্রোডাক্ট সিলেক্ট করা</h3>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 512 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">ব্যবসার প্ল্যান ও গোল তৈরি করা</h3>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 512 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">ব্যবসার আইডিয়া বের করা</h3>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 512 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">প্রোডাক্ট সৌরচিং আইডিয়া থাকা</h3>
                        </div>
                    </div>
                </div>
            </section>
            <section className="pt-10 lg:pt-24">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
                    <div>
                        <img className="rounded-lg" src={LEFTIMG} alt="" />
                    </div>
                    <h2 className="text-[#025A80] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold bg-[#E5F0FF] p-2.5 rounded-3xl">
                        এই "COURSE" থেকে যা যা শিখতে পারবেন
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    আইডিয়া
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    মার্কেট রিসার্চ করে প্ৰডাক্ট এর আইডিয়া বের করা
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    উইনিং প্রোডাক্ট
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Amazon এর জন্য উইনিং প্রোডাক্ট খুঁজে বের করা
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    রিসার্চ
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    মার্কেট রিসার্চ করে প্ৰডাক্ট এর আইডিয়া বের করা
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    মার্কেটিং
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    সঠিক পদ্ধতিতে Amazon এর মার্কেটিং করা
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    FBA/FBM
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    FBA/FBMএর প্রক্রিয়া সম্পর্কে ভালোভাবে জানা
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    LTD/LLC
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    US LLC এবং UK LTD কি?
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Authorized Distributors for Private Label and Brand Approval
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Products Listing
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    কিভাবে আপনার product listing করবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Keyword Research
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    কিভাবে Keyword research করবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Worldwide Selling
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    কীভাবে বিশ্বব্যাপী পণ্য বিক্রি করবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Own Branding
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    কিভাবে আপনার নিজের ব্র্যান্ড চালু করবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Amazon Trademark Registration & Brand Registry
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Amazon Trademark Registration & Brand Registry
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    কিভাবে Amazon PPC ক্যাম্পেইন চালাবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    ADS কিভাবে Facebook এবং Instagram AD চালাবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Tiktok Ad কিভাবে Amazon এর জন্য TikTok এ AD চালাবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Dropshipping
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    কিভাবে Dropshipping করবেন
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Invoice
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Amazon Invoice Requirements for Brand
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Noon, ETSY, Walmart, Shopify and Woo ommers
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Airbnb
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    How to Start Airbnb
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Problem solving and business idea Individual and Corporate
                                    sales
                                </h3>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col items-center gap-5 bg-[#333333] rounded-xl">
                            <div>
                                <svg
                                    aria-hidden="true"
                                    className="size-16 fill-[#FFBD00] text-[#FFBD00] hover:fill-[#971F1F] hover:text-[#971F1F] transition-all ease-in-out duration-300"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                                </svg>
                            </div>
                            <div className="space-y-5 lg:space-y-7 text-center">
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Free Lifetime Support
                                </h3>
                                <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">
                                    Free Lifetime support থাকবে
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-10 lg:pt-24">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
                    <h2 className="text-[#0D203B] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold p-2.5 rounded-2xl border-4 border-[#E41515]">
                        বিগত সময়ে আমার কোর্সে অংশগ্রহণ করার পর স্টুডেন্টদের ফিডব্যাক
                    </h2>
                </div>
            </section>

            <section className="pt-10 lg:pt-24">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
                    <div className="flex flex-col lg:flex-row gap-5 items-center flex-nowrap">
                        <div className="w-full h-96">
                            <img
                                className="w-full h-full"
                                src={ULT}
                                alt=""
                            />
                        </div>
                        <div className="w-full bg-[#3B3C3D]">
                            <h3 className="text-white text-center p-2.5">
                                Book a free call now to discover the Amazon course
                            </h3>
                            <form
                                action=""
                                className="bg-[#BCC701] p-2.5 flex flex-col gap-2.5"
                            >
                                <input
                                    className="rounded-none border border-[#5F5F5F] p-2.5 text-black"
                                    type="text"
                                    placeholder="Name"
                                />
                                <input
                                    className="rounded-none border border-[#5F5F5F] p-2.5 text-black"
                                    type="text"
                                    placeholder="What'sApp number"
                                />
                                <input
                                    className="rounded-none border border-[#5F5F5F] p-2.5 text-black"
                                    type="text"
                                    placeholder="Country Name"
                                />
                                <input
                                    className="rounded-none border border-[#5F5F5F] p-2.5 text-black"
                                    type="text"
                                    placeholder="Message"
                                />
                                <button
                                    className="p-2.5 rounded-none text-xl font-medium bg-[#3B3C3D]! text-white!"
                                    type="submit"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-5 items-center flex-nowrap">
                        <div className="w-full">
                            <h2 className="text-[#0D203B] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold">
                                Click to send WhatsApp message
                            </h2>
                        </div>
                        <div className="w-full flex justify-center">
                            <a
                                href="#"
                                className="size-36 rounded-2xl flex items-center justify-center bg-[#25d366] transform hover:scale-[0.8] transition duration-300"
                            >
                                <svg
                                    className="size-16 fill-white"
                                    viewBox="0 0 448 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-10 lg:pt-24">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="3,24000 AED SALE - Jahidul form Al ain worked in Cafe shop befor| g #sell #automobile #shelby #"
                            src="https://www.youtube.com/embed/sg2fiRGZQ6c?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=3&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExaTRMaUltQnl6RGY1WHZoNwEee468PaLPLhhWu0YrsX9lRoVXSKi4hBTOh3XaffZ0dhI3e9n7JChLARnGgwQ_aem_5kr89GyR283R-pshVNpROA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget4"
                            data-gtm-yt-inspected-12="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="4200 AED SALE CLINET FROM SHARJHA | sales in 1 month"
                            src="https://www.youtube.com/embed/shEwvlhmvnU?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=5&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget6"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="1 Millions 10000 AED SALES ON 6 month from noon and amaozn | Amazon sales -noon sales"
                            src="https://www.youtube.com/embed/hlhPIEOs61o?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=7&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget8"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="কিভাবে amazon থেকে মিলিয়ন ডলার আয় করা যায় এবং | আমি কিভাবে সাহায্য করতে পারি"
                            src="https://www.youtube.com/embed/iSjnSIvppIw?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=9&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget10"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="কিভাবে AMAZION থেকে মিলিয়ন ডলার আয় করা যায় ?"
                            src="https://www.youtube.com/embed/T2FMXBakpYc?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=13&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget14"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="Avoid Mistakes: Order Removal Process On Amazon | অ্যামাজন সেলার সেন্ট্রালে কীভাবে Order বাদ দেবেন |"
                            src="https://www.youtube.com/embed/8Ou0xO4dx-k?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=17&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget18"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="কিভাবে আপনি বিশ্বের যে কোন জায়গা and Bangladesh থেকে Amazon এ বিক্রি করে অর্থ উপার্জন করতে পারেন |"
                            src="https://www.youtube.com/embed/V_7uVAvA4b8?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=11&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget12"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="Amazon and e-commerce in Dubai | SELINA RAHMAN VLOGS"
                            src="https://www.youtube.com/embed/WmMv1eC4dgM?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=15&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget16"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                    <div>
                        <iframe
                            className="w-full h-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="Unlock Amazon Selling in Dubai, UAE, KSA, Singapore, Qatar, and More!"
                            src="https://www.youtube.com/embed/yBYdRBGlTS8?controls=1&amp;rel=0&amp;playsinline=0&amp;modestbranding=0&amp;autoplay=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fbjollys.com&amp;widgetid=19&amp;forigin=https%3A%2F%2Fbjollys.com%2Fe-commerce%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExYWI1cWhLMEVNQ1hJSGZ6ZAEeHAdPaka1jhaI5nyV4q_p_RNrVpqjVBrzdsUujwlnJmWGkyR0SvhJN7C-nSk_aem_b_3JZtXkh6uGu4VixY5riA&amp;aoriginsup=1&amp;gporigin=https%3A%2F%2Fwww.facebook.com%2F&amp;vf=1"
                            id="widget20"
                            data-gtm-yt-inspected-9="true"
                        ></iframe>
                    </div>
                </div>
            </section>

            <section className="pt-10 lg:pt-24">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 xl:grid-cols-3 gap-x-2.5 gap-y-10">
                    <div className="text-center">
                        <h3 className="text-4xl xl:text-6xl font-semibold text-[#777]">
                            1,500 <span>+</span>
                        </h3>
                        <p className="underline text-base xl:text-2xl font-normal text-[#777]">
                            Clients
                        </p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl xl:text-6xl font-semibold text-[#777] text-nowrap">
                            $ 10,000,000<span>+</span>
                        </h3>
                        <p className="underline text-base xl:text-2xl font-normal text-[#777]">
                            Revenue generated
                        </p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl xl:text-6xl font-semibold text-[#777]">
                            500<span>+</span>
                        </h3>
                        <p className="underline text-base xl:text-2xl font-normal text-[#777]">
                            Companies
                        </p>
                    </div>
                </div>
            </section>

            <section className="pt-10 lg:pt-24">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5">
                    <h2 className="text-[#242424] text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold">
                        প্রশ্ন এবং উত্তর
                    </h2>
                    <div className="">
                        <details className="border-b border-gray-200 p-4">
                            <summary className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer">
                                কোর্সগুলোর সাথে সাপোর্ট পাবো কিভাবে?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div className="mt-4">
                                <p className="text-base font-normal text-black">
                                    সাপোর্টের জন্য মূলত আমাদের একটি গ্রুপ থাকবে, আমার সাপোর্ট টিম
                                    থাকবে এবং আপনাদের সমস্যা নিয়ে আমি নিজেই মাঝে মাঝে জুম মিটিংয়ের
                                    মাধ্যমে সমাধান করবো ইনশাআল্লাহ্‌
                                </p>
                            </div>
                        </details>
                        <details className="border-b border-gray-200 p-4">
                            <summary className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer">
                                কোর্সগুলো শেষ করতে কতদিন লাগবে?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div className="mt-4">
                                <p className="text-base font-normal text-black">
                                    15 working days
                                </p>
                            </div>
                        </details>
                        <details className="border-b border-gray-200 p-4">
                            <summary className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer">
                                1 by 1 course কি থাকবে ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div className="mt-4">
                                <p className="text-base font-normal text-black">
                                    Unlimited class with flexible time until sales happen
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                Full course এর সাথে কি products থাকবে ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    Budget অনুযায়ী Products সরবারহ, 3pl service with guarantee
                                    sales only with amazon FBA
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                MPL and PL করতে budget কত লাগবে ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    1500 dollar for MPL and 3500 to 5000 dollar for PL.
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                কত budget হলে FBA business শুরু করা যায় ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    সর্বনিম্ন 500 dollar লাগবে
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                class video কি দেওয়া থাকবে ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    Course শেষ হবার পর সব vidoe দেওয়া হবে ?
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                Online course কি এবং weekly কয়দিন হবে ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    One and half hour to two hours and 3 to 4 class in week
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                Product add করার কতদিন পর থেকে sale শুরু হবে ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    যদি আমরা PPC করি তাহলে 7 থেকে ২১ দিনের মধ্যে sale শুরু হবে.
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                Noon এবং Amazon এ কি একসাথে business করতে পারবে ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    UAE এর E-commerce বা LLC license থাকলে Noon, Amazon এর সাথে ১৫
                                    টা platform এ business করতে পারবে
                                </p>
                            </div>
                        </details>
                        <details
                            className="border-b border-gray-200 p-4"
                        >
                            <summary
                                className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-[#0D203B] font-semibold cursor-pointer"
                            >
                                আপনি কি Bangladesh থেকে করতে পারবেন ?
                                <svg
                                    className="w-5 h-5 transform transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </summary>
                            <div
                                className="mt-4"
                            >
                                <p className="text-base font-normal text-black">
                                    আপনার I’D, bank account & Debit card থাকলে আপনি পৃথিবীর ২০০ টি
                                    দেশ থেকে Amazon, Dropshipping এবং E-commerce করতে পারবেন.
                                </p>
                            </div>
                        </details>
                    </div>
                    <div className="mt-5 flex items-center justify-center">
                        <button
                            type="button"
                            className="bg-[#021A6B] font-medium text-2xl lg:text-3xl rounded-full px-10 py-5 text-white cursor-pointer"
                            onClick={handleEcommercePaymnet}
                        >
                            কোর্সে জয়েন করুন
                        </button>
                    </div>
                </div>
            </section>


            <section className="py-8 lg:py-12">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5 md:gap-y-10">
                    <h2 className="text-[#025A80] text-2xl lg:text-5xl font-semibold bg-[#E5F0FF] px-5 py-3 rounded-3xl text-center">Service Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5">
                        {ecommerceService?.map((item: any) => {
                            return (
                                <div className="border rounded-xl p-2.5 lg:p-4 flex flex-col items-center gap-4 cursor-pointer" key={item.id}>
                                    <div className="flex flex-col flex-wrap w-full overflow-hidden">
                                        <img src={`${MEDIA_URL}${item.image}`} alt={item.title} className="w-full h-auto rounded-full object-cover hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="text-center space-y-2 grow flex flex-col items-center justify-end">
                                        <h3 className="text-[#6EC1E4] font-medium text-xl lg:text-2xl">{item.title}</h3>
                                        <p className="text-[#6EC1E4] text-sm lg:text-base">Price : {item.price}$</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

        </main>
    );
}
