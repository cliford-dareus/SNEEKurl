import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RootState} from "../store";

const URL = "https://sneekurl-server.onrender.com/short" || "http://localhost:4080/short";

export interface Metadata {
    time: Date;
    ipAddress: string | undefined;
    userAgent: string | undefined;
    referer: string | undefined;
    country: string;
    isMobile: boolean;
}

export interface Url {
    longUrl: string;
    short: string;
    favorite: string[];
    isShareable: boolean;
    isLogin: boolean;
    creatorId: string;
    password?: string;
    expired_in?: Date;
    totalClicks?: number;
    lastClick?: Date;
    metadata: Metadata[];
    _id: string;
    __v: number;
}

export interface UrlResponse {
    short: Url;
    guest?: string;
    message?: string;
}

export interface UrlsResponse {
    urls: Url[];
}

export interface UrlRequest {
    longUrl: string;
    backhalf?: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: URL,
    credentials: "include",
    headers: {
        Accept: "application/json",
    },
    prepareHeaders: (headers, {getState}) => {
        const csrfToken = sessionStorage.getItem("csrfToken");
        if (csrfToken) {
            headers.set("X-CSRF-Token", csrfToken);
        }
        return headers;
    },
});

// Enhanced base query with automatic token refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 and it's a token expired error, try to refresh
    if (result.error && result.error.status === 401) {
        const errorData = result.error.data as any;
        if (errorData?.code === 'TOKEN_EXPIRED') {
            // Try to refresh the token
            const refreshResult = await baseQuery(
                {url: '/auth/refresh', method: 'POST'},
                api,
                extraOptions
            );

            if (refreshResult.data) {
                // Retry the original request
                result = await baseQuery(args, api, extraOptions);
            } else {
                // Refresh failed, redirect to login
                window.location.href = '/login';
            }
        }
    }

    return result;
}

export const urlapi = createApi({
    reducerPath: "urlapi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["SHORT", "GUEST_SHORT", "SHORT_CLICKS", "USER"],
    endpoints: (builder) => ({
        shortenUrl: builder.mutation<UrlResponse, UrlRequest>({
            query: (credentials) => ({
                url: "/create",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["SHORT", "GUEST_SHORT", "USER"],
        }),
        getUrlClicks: builder.query({
            query: () => ({
                url: "/clicks"
            }),
            providesTags: ["SHORT_CLICKS"],
        }),
        getGuestUrl: builder.query<UrlsResponse, any>({
            query: (query) => ({
                url: `/`,
            }),
            providesTags: ["GUEST_SHORT"],
        }),
        getUrls: builder.query<UrlsResponse, any>({
            query: (query) => ({
                url: `/urls?${query ? query : ""}`,
            }),
            providesTags: ["SHORT"],
        }),
        getUrl: builder.query<UrlResponse, any>({
            query: (query) => ({
                url: `/url/${query}`,
            }),
            providesTags: ["SHORT"],
        }),
        editUrl: builder.mutation<UrlResponse, any>({
            query: (payload) => ({
                url: "/edit",
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["SHORT"],
        }),
        deleteUrl: builder.mutation<any, string>({
            query: (short) => ({
                url: `/delete/${short}`,
                method: "DELETE",
            }),
            invalidatesTags: ['SHORT', 'USER']
        }),
        getLinkAnalytics: builder.query({
            query: (shortCode) => ({
                url: `/analytics/link/${shortCode}`,
            }),
            providesTags: ["SHORT"],
        }),
        getUserAnalytics: builder.query({
            query: () => ({
                url: `/analytics/user`,
            }),
            providesTags: ["SHORT"],
        }),
        getUserLimits: builder.query({
            query: () => ({
                url: "/get-limits",
            }),
            providesTags: ["USER", "SHORT"],
        }),
    }),
});

export const {
    useShortenUrlMutation,
    useGetUrlsQuery,
    useGetUrlQuery,
    useGetUrlClicksQuery,
    useGetUserLimitsQuery,
    useEditUrlMutation,
    useGetGuestUrlQuery,
    useDeleteUrlMutation,
    useGetLinkAnalyticsQuery,
    useGetUserAnalyticsQuery,
} = urlapi;
