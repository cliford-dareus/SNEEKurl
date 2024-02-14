import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const URL = "http://localhost:4080/stripe";

type Payload = {
  plan_price: number;
  username: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  credentials: "include", // Set credentials to "include"
});

export const stripeApi = createApi({
  reducerPath: "stripeApi",
  baseQuery,
  tagTypes: ["STRIPE"],
  endpoints: (builder) => ({
    retrieveSubscription: builder.query<any, void>({
      query: () => "/retrieve-subscription",
      providesTags: ["STRIPE"],
    }),
    createSubscription: builder.mutation<any, Payload>({
      query: (payload) => ({
        url: "/create-subscription",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["STRIPE"],
    }),
  }),
});

export const { useRetrieveSubscriptionQuery, useCreateSubscriptionMutation } =
  stripeApi;
