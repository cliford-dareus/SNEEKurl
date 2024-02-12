import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const URL = "http://localhost:4080/short";
export interface Url {
  longUrl: string;
  short: string;
  favorite: string[];
  isLogin: boolean;
  creatorId: string;
  _id: string;
  __v: number;
}

export interface UrlResponse {
  short: Url;
  guest?: string;
  message?: string;
}

export interface UrlsResponse {
  urls: Url[];
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
  reducerPath: 'urlapi',
  baseQuery,
  endpoints: (builder) => ({
    shortenUrl: builder.mutation<UrlResponse, UrlRequest>({
      query: (credentials) => ({
        url: "/create",
        method: "POST",
        body: credentials,
      }),
    }),
    getUrls: builder.query<UrlsResponse, void>({
      query: () => "/urls?page=1",
    }),
    editUrl: builder.mutation<UrlResponse, UrlRequest>({
      query: () => ({
        url: "/edit",
        method: "PUT",
        body: "credentials",
      }),
    }),
  }),
});

export const { useShortenUrlMutation, useGetUrlsQuery } = urlapi;
