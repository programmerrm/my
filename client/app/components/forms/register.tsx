import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Field } from "../field/field";
import { ReactIcons } from "~/utils/reactIcons";
import { Link, useNavigate } from "@remix-run/react";
import { RegisterPropsType } from "~/types/register/registerPropsType";
import { useAddRegisterMutation } from "~/redux/features/auth/authApi";
import { toast } from "react-toastify";

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [addRegister, { isLoading, isError, isSuccess }] =
        useAddRegisterMutation();
    const [isShow, setIsShow] = useState({
        password: false,
        confirm_password: false,
    });
    const [hovered, setHovered] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterPropsType>();

    const { IoMdEyeOff, IoEye } = ReactIcons;

    const togglePasswordVisibility = (field: "password" | "confirm_password") => {
        setIsShow((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const onSubmitForm = async (formData: RegisterPropsType) => {
        try {
            await addRegister(formData).unwrap();
            toast.success('Registered successfully!');
            reset();
            navigate('/login/');
        } catch (err: any) {
            if (err?.data?.message) {
                toast.error(err.data.message);
            } else if (err?.message) {
                toast.error(err.message); 
            } else {
                toast.error("Something went wrong during registration.");
            }
        }
    }

    return (
        <form
            className="flex flex-col flex-wrap gap-y-5 w-full"
            onSubmit={handleSubmit(onSubmitForm)}
        >
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label="" error={errors.name}>
                    <input
                        {...register("name", { required: "Name is required" })}
                        id="name"
                        placeholder="Name"
                        type="text"
                        className="input"
                    />
                </Field>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label="" error={errors.email}>
                    <input
                        {...register("email", { required: "Email is required" })}
                        id="email"
                        placeholder="Email"
                        type="email"
                        className="input"
                    />
                </Field>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                    <Field label="" error={errors.number}>
                        <input
                            {...register("number", { required: "Number is required" })}
                            id="number"
                            placeholder="Enter Whatsapp Number"
                            type="text"
                            className="input"
                        />
                    </Field>
                </div>
                <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                    <Field label="" error={errors.country}>
                        <input
                            {...register("country", { required: "Country is required" })}
                            id="country"
                            placeholder="Country"
                            type="text"
                            className="input"
                        />
                    </Field>
                </div>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label="" error={errors.date_of_birth}>
                    <input
                        {...register("date_of_birth", {
                            required: "Date of birth is required",
                        })}
                        id="date_of_birth"
                        type="date"
                        className="input"
                    />
                </Field>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                    <Field label="" error={errors.password}>
                        <div className="relative w-full">
                            <input
                                {...register("password", { required: "Password is required" })}
                                id="password"
                                type={isShow.password ? "text" : "password"}
                                placeholder="Password"
                                className="input w-full"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("password")}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                {isShow.password ? (
                                    <IoMdEyeOff className="text-gray-600 text-lg" />
                                ) : (
                                    <IoEye className="text-gray-600 text-lg" />
                                )}
                            </button>
                        </div>
                    </Field>
                </div>
                <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                    <Field label="" error={errors.confirm_password}>
                        <div className="relative w-full">
                            <input
                                {...register("confirm_password", {
                                    required: "Confirm password is required",
                                })}
                                id="confirm_password"
                                type={isShow.confirm_password ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="input w-full"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm_password")}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                {isShow.confirm_password ? (
                                    <IoMdEyeOff className="text-gray-600 text-lg" />
                                ) : (
                                    <IoEye className="text-gray-600 text-lg" />
                                )}
                            </button>
                        </div>
                    </Field>
                </div>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                <Field label="" error={errors.signature}>
                    <input
                        {...register("signature", { required: "Signature is required" })}
                        id="signature"
                        placeholder="Signature"
                        type="text"
                        className="input"
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                    <Field label="" error={errors.gender}>
                        <select
                            {...register("gender", { required: "Gender is required" })}
                            className="input"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </Field>
                </div>
                <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                    <Field label="" error={errors.role}>
                        <select
                            {...register("role", { required: "Account type is required" })}
                            className="input"
                        >
                            <option value="">Account Type</option>
                            <option value="crypto">Crypto</option>
                            <option value="e-commerce">E-commerce</option>
                        </select>
                    </Field>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-2.5 justify-center items-center lg:justify-normal lg:items-start w-full">
                    <Field label="" error={errors.terms_accepted}>
                        <div className="flex items-center gap-2.5">
                            <input
                                {...register("terms_accepted", {
                                    required: "You must accept the terms",
                                })}
                                type="checkbox"
                                id="terms_accepted"
                                className="w-4 lg:w-5 h-4 lg:h-5"
                            />
                            <span className="text-sm lg:text-base">
                                I agree to the{" "}
                                <Link to="/" className="text-blue-600 underline">
                                    Terms & Conditions
                                </Link>
                            </span>
                        </div>
                    </Field>
                </div>
                <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
                    <div className="flex flex-col justify-center lg:justify-end items-center lg:items-end">
                        <Link className="text-blue-600 text-sm lg:text-base underline" to="/login/">
                            Already have an account?
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-wrap w-full">
                <button
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className={`text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-500 border ${hovered
                        ? "bg-transparent text-black border-black"
                        : "bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white"
                        }`}
                    type="submit"
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    );
};
