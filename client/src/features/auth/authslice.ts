import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type User = {
  email: string;
  username: string;
  stripe_account_id: string;
  isVerified: boolean;
};

export type AuthState = {
  user: User;
  token: string;
};

const initialState = {
  user: {},
  token: localStorage.getItem("token"),
} as AuthState;

const authslice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: User }>
    ) => {
            (state.token = localStorage.getItem("token") as string);
            (state.user.username = user.username);
            (state.user.email = user.email);
            (state.user.stripe_account_id = user.stripe_account_id);
            (state.user.isVerified = user.isVerified);
    },
    removeCredentials: (state) => {
      localStorage.removeItem("token");
        (state.token = "");
        (state.user.username = "");
        (state.user.stripe_account_id = "");
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.auth;
export const { setCredentials, removeCredentials } = authslice.actions;
export default authslice.reducer;
