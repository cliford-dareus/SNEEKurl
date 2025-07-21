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
  credentials: "include",
  headers: {
    Accept: "application/json",
  },
  prepareHeaders: (headers, { getState }) => {
    // Add CSRF token to all requests
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
    return headers;
  },
})

// Enhanced base query with automatic token refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 and it's a token expired error, try to refresh
  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any;
    if (errorData?.code === 'TOKEN_EXPIRED') {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST' },
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

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
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
    refreshToken: builder.mutation<UserResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
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
})

export const {
  useLoginMutation,
  useProtectedMutation,
  useRegisterMutation,
  useLogoutUserMutation,
  useIdentifyUserMutation,
  useRefreshTokenMutation
} = authApi
