import { createSlice } from "@reduxjs/toolkit";
export interface UserInterface {
    name: string;
    userId: string;
};

const user = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')!): ''

const initialState: UserInterface = {
    name: user?.userName || '',
    userId: user?.userId || ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, actions) => {
            state.name = actions.payload.userName, state.userId = actions.payload.userId
            localStorage.setItem('user', JSON.stringify(actions.payload));
        },
        // clear user
            // clear localStorage
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;