import { apiSlice } from "../api/apiSlice";

export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (data) => ({
                url: "/payments/create-checkout-session/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useCreateCheckoutSessionMutation,
} = paymentsApi;
