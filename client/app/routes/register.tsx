import { MetaFunction } from "@remix-run/node"
import { Footer } from "~/components/footer/footer";
import { RegisterForm } from "~/components/forms/register";
import { Header } from "~/components/header/header";

export const meta: MetaFunction = () => {
    return [
        { title: "Bijolis - Register From" },
        { name: "description", content: "Welcome to Remix!" },
    ];
}

export default function Register() {
    return (
        <section className="relative top-0 left-0 right-0 w-full">
            <section className="relation top-0 left-0 right-0 py-10 lg:py-20 w-full">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                    <div className="flex flex-col flex-wrap justify-center items-center w-full">
                        <div className="flex flex-col flex-wrap w-full lg:w-[70%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]">
                            <div className="flex flex-col flex-wrap w-full py-5 lg:py-10 px-2.5 lg:px-10 gap-y-10 bg-white rounded-[18px]">
                                <h2 className="text-2xl font-medium uppercase text-center">Signup</h2>
                                <RegisterForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}