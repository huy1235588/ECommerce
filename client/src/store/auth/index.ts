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

interface FormData {
    email: string;
    country: string;
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
}

interface verifyEmailPayload {
    email: string;
    code: string;
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
    FormData
>(
    "/auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/signup',
                formData,
                { withCredentials: true, }
            );

            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

export const verifyEmail = createAsyncThunk<
    AuthResponse,
    verifyEmailPayload
>(
    "/auth/verify-email",
    async (verifyEmailPayload, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/verify-email',
                verifyEmailPayload,
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Verification email failed");
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

            // Verify Email
            .addCase(verifyEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated =false;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.error as string;
            })
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;