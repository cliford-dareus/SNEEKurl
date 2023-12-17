import { createSlice } from "@reduxjs/toolkit";
import { UserInterface } from "../types/types";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : "";

const initialState: UserInterface = {
  name: user?.userName || "",
  userId: user?.userId || "",
  token: user?.token || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, actions) => {
      (state.name = actions.payload.userName),
        (state.userId = actions.payload.userId),
        (state.token = actions.payload.accessTokenJWT);
      localStorage.setItem("user", JSON.stringify(actions.payload));
      console.log(actions);
    },
    deleteUser: (state) => {
      (state.name = ""), (state.userId = ""), (state.token = "");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
