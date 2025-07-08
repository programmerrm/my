import { apiSlice } from "../api/apiSlice";

export const configurationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLogo: builder.query({
            query: () => '/configuration/logo/',
        }),
        getFooterLogo: builder.query({
            query: () => '/configuration/footer-logo/',
        }),
        getBanner: builder.query({
            query: () => '/configuration/banner/',
        }),
        getTeam: builder.query({
            query: () => '/configuration/teams/',
        }),
        getWhy_us: builder.query({
            query: () => '/configuration/why-choose-us/',
        }),
        getService: builder.query({
            query: () => '/configuration/services/',
        }),
        getOfficialInfo: builder.query({
            query: () => '/configuration/official-info/'
        }),
        getAbout: builder.query({
            query: () => '/configuration/about/',
        }),
    }),
});

export const {
    useGetLogoQuery,
    useGetFooterLogoQuery,
    useGetBannerQuery,
    useGetTeamQuery,
    useGetWhy_usQuery,
    useGetServiceQuery,
    useGetOfficialInfoQuery,
    useGetAboutQuery,
} = configurationApi;
