import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type User = {
  username: string;
}

 export type AuthState = {
  user: User;
  token: string | null;
};

const authslice = createSlice({
  name: "auth",
  initialState: { user: {}, token: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: string; token: string }>
    ) => {
      state.user.username = user;
      state.token = token;
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.auth;
export const { setCredentials } = authslice.actions;
export default authslice.reducer;
