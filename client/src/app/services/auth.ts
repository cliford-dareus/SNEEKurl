import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export interface User {
  username: string;
  email: string;
  stripe_account_id: string;
  isVerified: boolean;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4080",
  credentials: "include", // Set credentials to "include"
  headers: {
    Accept: "application/json",
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<UserResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation<UserResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => "protected",
    }),
    identifyUser: builder.mutation<UserResponse, any>({
      query: (result: any) => ({
        url: `/sneekurl/fp?client_id=${result.visitorId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useProtectedMutation,
  useRegisterMutation,
  useLogoutUserMutation,
  useIdentifyUserMutation
} = authApi;
