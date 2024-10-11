import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { IsAny } from "@reduxjs/toolkit/dist/tsHelpers";

const URL = "http://localhost:4080/stripe";

type Payload = {
  plan_price: number;
  username?: string;
  subscriptionId?: string;
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
    retrieveSubscription: builder.query<any, {username: string}>({
      query: (user) => `/retrieve-subscription/${user?.username}`,
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
    updateSubscription: builder.mutation<any, Payload>({
      query: (payload) => ({
        url: "/update-subscription",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["STRIPE"],
    }),
  }),
});

export const {
  useRetrieveSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} = stripeApi;
