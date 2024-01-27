import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { urlapi } from "./services/urlapi";
// import { apiSlice } from "../features/urlslice";
import qrReducer from "../features/qr/qrslice";

export const store = configureStore({
  reducer: {
    // user: userReducer,
    qr: qrReducer,
    [urlapi.reducerPath]: urlapi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(urlapi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
