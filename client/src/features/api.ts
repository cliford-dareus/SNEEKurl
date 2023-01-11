import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'UrlApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4080/api/v1'
    }),
    endpoints: (build) => ({
        registerUser: build.mutation({
            query:(body) => ({
                url: '/auth/register',
                method: 'POST',
                body
            })
        }),
        loginUser: build.mutation({
            query:(body) => ({
                url: '/auth/login',
                method: 'POST',
                body
            })
        }),
        addUrl: build.mutation({
            query: (body) => ({
                url:'/short',
                method: 'POST',
                body
            })
        }),
        getUrls: build.query({
            query: () => '/short/all'
        })
    })
});

export const { useRegisterUserMutation, useLoginUserMutation, useAddUrlMutation, useGetUrlsQuery } = apiSlice;