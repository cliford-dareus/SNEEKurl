import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'UrlApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4080/api/v1'
    }),
    tagTypes: ['short', 'user'],
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
            }),
            invalidatesTags: ['short']
        }),
        getUrls: build.query({
            query: () => ({
                url: '/short/all',
            }),
            providesTags: ['short']
        }),
        deleteUrl: build.mutation({
            query: (params) => ({
                url: `/short/${params}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['short']
        }),
        favoriteUrl: build.mutation({
            query: (params) => ({
                url: `/short/${params}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['short']
        }),
        visitUrl: build.query({
            query: (params) => ({
                url: `/short/${params}`
            })
        })
    })
});

export const { useRegisterUserMutation, useLoginUserMutation, useAddUrlMutation, useGetUrlsQuery, useDeleteUrlMutation, useFavoriteUrlMutation, useVisitUrlQuery } = apiSlice;