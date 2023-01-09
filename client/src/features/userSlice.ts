import { createSlice } from "@reduxjs/toolkit";

export interface UserInterface {
    name: string;
    userId: string;
};

const initialState: UserInterface = {
    name: '',
    userId: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, actions) => {
            state.name = actions.payload.userName, state.userId = actions.payload.userId
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;