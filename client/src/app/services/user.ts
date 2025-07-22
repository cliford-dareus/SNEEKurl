import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryArg } from "@reduxjs/toolkit/dist/query/baseQueryTypes";

const URL = "http://localhost:4080/user";

const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  credentials: "include", // Set credentials to "include"
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
export const userapi = createApi({
  reducerPath: "userapi",
  baseQuery,
  tagTypes: ["USER"],
  endpoints: (builder) => ({
    updateUserProfileImage: builder.mutation({
      query: (file) => ({
        method: "PUT",
        url: "/update-image",
        body: file,
      }),
    }),
    updateUserDetails: builder.mutation({
      query: (information) => ({
        url: "/update-info",
        method: "PUT",
        body: information,
      }),
    }),
    deleteUserAccount: builder.mutation({
      query: () => ({
        url: "/delete-account",
        method: "DELETE",
      }),
    }),
    getUserLimits: builder.query({
      query: () => ({
        url: "/get-limits",
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useUpdateUserProfileImageMutation,
  useUpdateUserDetailsMutation,
  useDeleteUserAccountMutation,
  useGetUserLimitsQuery,
} = userapi;
