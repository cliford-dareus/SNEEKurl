import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const URL = "http://localhost:4080/short";
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

const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  credentials: "include", // Set credentials to "include"
});

export const urlapi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    shortenUrl: builder.mutation<UrlResponse, UrlRequest>({
      query: (credentials) => ({
        url: "/create",
        method: "POST",
        body: credentials,
      }),
    }),
    getUrls: builder.query<Url[], any>({
      query: () => "/api/v1/all",
    }),
  }),
});

export const { useShortenUrlMutation, useGetUrlsQuery } = urlapi;
