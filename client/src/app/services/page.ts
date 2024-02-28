import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const URL = "http://localhost:4080/page";


const baseQuery = fetchBaseQuery({
    baseUrl: URL,
    credentials: "include", // Set credentials to "include"
});

export const pageapi = createApi({
    reducerPath: 'pageapi',
    baseQuery,
    tagTypes: ['PAGE'],
    endpoints: (builder) => ({
        getPages: builder.query<any, void>({
            query: (query) => ({
                url: "",
            }),
            providesTags: ["PAGE"],
        }),
        createPage: builder.mutation({
            query: (payload) => ({
                url: "/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["PAGE"],
        }),
        updatePage: builder.mutation({
            query: (payload) => ({
                url: "/update",
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["PAGE"],
        }),
    }),
})

export const {
    useCreatePageMutation,
    useUpdatePageMutation,
    useGetPagesQuery
} = pageapi;