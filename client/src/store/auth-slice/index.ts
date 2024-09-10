import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu cho state
interface authSlice {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any;
}

const initialState: authSlice = {
    isAuthenticated: false,
    isLoading: false,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {

        },
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;