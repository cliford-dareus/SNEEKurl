import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RootState} from "../store";

const URL = "http://localhost:4080/short";

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
    clicks?: number;
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
    prepareHeaders: (headers, { getState }) => {
        const csrfToken = sessionStorage.getItem("csrfToken");
        if (csrfToken) {
            headers.set("X-CSRF-Token", csrfToken);
        }
        return headers;
    },
});

export const urlapi = createApi({
    reducerPath: "urlapi",
    baseQuery,
    tagTypes: ["SHORT", "GUEST_SHORT", "SHORT_CLICKS"],
    endpoints: (builder) => ({
        shortenUrl: builder.mutation<UrlResponse, UrlRequest>({
            query: (credentials) => ({
                url: "/create",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["SHORT", "GUEST_SHORT"],
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
                url: `/urls?${query?query : ""}`,
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
            invalidatesTags: ['SHORT']
        })
    }),
});

export const {
    useShortenUrlMutation,
    useGetUrlsQuery,
    useGetUrlQuery,
    useGetUrlClicksQuery,
    useEditUrlMutation,
    useGetGuestUrlQuery,
    useDeleteUrlMutation
} = urlapi;
