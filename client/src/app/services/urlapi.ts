import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const URL = "http://localhost:4080";
export interface Url {
  longUrl: string;
  favorite: boolean;
  clicks: number;
  isLogin: boolean;
  creatorId: string;
  _id: string;
  short: string;
  __v: number;
}

export interface UrlResponse {
  short: Url;
  guest?: string;
}

export interface UrlRequest {
  longUrl: string;
  backhalf?: string;
}

export const urlapi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
    // prepareHeaders: (headers, { getState }) => {
    //   By default, if we have a token in the store, let's use that for authenticated requests
    //   const token = (getState() as RootState).auth.token;
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    shortenUrl: builder.mutation<UrlResponse, UrlRequest>({
      query: (credentials) => ({
        url: "/api/v1/short",
        method: "POST",
        body: credentials,
      }),
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => "protected",
    }),
  }),
});

export const { useShortenUrlMutation, useProtectedMutation } = urlapi;
