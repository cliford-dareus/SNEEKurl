import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {EndpointBuilder} from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

const URL = "http://localhost:4080/user";

const baseQuery = fetchBaseQuery({
    baseUrl: URL,
    credentials: "include", // Set credentials to "include"
});
export const userapi = createApi({
    reducerPath: 'userapi',
    baseQuery,
    tagTypes: ['USER'],
    endpoints: (builder) => ({
        updateUserProfileImage: builder.mutation({
            query: (file) => ({
                method: 'PUT',
                url: '/update-image',
                body: file
            })
        }),
        updateUserDetails: builder.mutation({
            query: (information) => ({
                url: '/update-info',
                method: 'PUT',
                body: information
            })
        })
    }),
})

export const {
    useUpdateUserProfileImageMutation,
    useUpdateUserDetailsMutation
} = userapi;