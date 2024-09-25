import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

interface User {
    id: string,
    email: string,
    userName: string,
}

interface AuthSlice {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    error?: string | null;
}

interface formData {
    email: string;
    country: string;
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
}

const initialState: AuthSlice = {
    isAuthenticated: false,
    isLoading: false,
    user: null
}

interface AuthResponse {
    success: boolean,
    user: User,
}

export const registerUser = createAsyncThunk<
    AuthResponse,
    formData
>(
    "/auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/ha',
                formData,
                { withCredentials: true, }
            );

            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;