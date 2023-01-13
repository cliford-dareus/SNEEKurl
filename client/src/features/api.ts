import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';

export const apiSlice = createApi({
    reducerPath: 'UrlApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4080/api/v1',
    }),
    tagTypes: ['short', 'user'],
    endpoints: (build) => ({
        registerUser: build.mutation({
            query:(body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
                credentials: 'include'
            })
        }),
        loginUser: build.mutation({
            query:(body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
                credentials: 'include'
            })
        }),
        addUrl: build.mutation({
            query: (body) => ({
                url:'/short',
                method: 'POST',
                body,
                credentials: 'include'
            }),
            invalidatesTags: ['short']
        }),
        getUrls: build.query({
            query: () => ({
                url: `/short/all`,
                credentials: 'include'
            }),
            providesTags: ['short']
        }),
        deleteUrl: build.mutation({
            query: (params) => ({
                url: `/short/${params}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: ['short']
        }),
        favoriteUrl: build.mutation({
            query: (params) => ({
                url: `/short/${params}`,
                method: 'PATCH',
                credentials: 'include'
            }),
            invalidatesTags: ['short']
        }),
        visitUrl: build.query({
            query: (params) => ({
                url: `/short/${params}`,
                credentials: 'include'
            })
        })
    })
});



export const { useRegisterUserMutation, useLoginUserMutation, useAddUrlMutation, useGetUrlsQuery, useDeleteUrlMutation, useFavoriteUrlMutation, useVisitUrlQuery } = apiSlice;