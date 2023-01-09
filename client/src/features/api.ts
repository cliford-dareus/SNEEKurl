import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'UrlApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4080'
    }),
    endpoints: (build) => ({
        registerUser: build.mutation({
            query:(body) => ({
                url: '/api/v1/auth/register',
                method: 'POST',
                body
            })
        }),
        loginUser: build.mutation({
            query:(body) => ({
                url: '/api/v1/auth/login',
                method: 'POST',
                body
            })
        }),
        addUrl: build.mutation({
            query: (body) => ({
                url:'/api/v1/short/add',
                method: 'POST',
                body
            })
        })
    })
});

export const { useRegisterUserMutation, useLoginUserMutation, useAddUrlMutation } = apiSlice;