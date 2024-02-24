import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import qrReducer from "../features/qr/qrslice";
import authReducer from "../features/auth/authslice";
import { authApi } from "./services/auth";
import { stripeApi } from "./services/stripe";
import { urlapi } from "./services/urlapi";
import {userapi} from "./services/user";

export const store = configureStore({
  reducer: {
    [urlapi.reducerPath]: urlapi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userapi.reducerPath]: userapi.reducer,
    [stripeApi.reducerPath]: stripeApi.reducer,
    qr: qrReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      urlapi.middleware,
      authApi.middleware,
      userapi.middleware,
      stripeApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
