import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { FormData } from "@/pages/auth/register";

interface verifyEmailPayload {
    email: string;
    code: string;
}

// Định nghĩa AuthSlice
interface AuthSlice {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: Object | null;
    error?: string | null;
    status?: number;
}

// Khởi tạo trạng thái ban đầu của AuthSlice
const initialState: AuthSlice = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    status: undefined,
}

// Định nghĩa trạng thái phản hồi của api
interface AuthResponse {
    success: boolean,
    message: string,
    status?: number,
    clientId: string,
}

// Định nghĩa trạng thái lỗi của api
interface AuthError {
    message: string;
    status: number;
}

export const registerUser = createAsyncThunk<
    AuthResponse,
    FormData,
    { rejectValue: AuthError }
>(
    "/auth/register",
    async (
        formData,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/signup',
                formData,
                { withCredentials: true, }
            );

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "Registration failed";

            return rejectWithValue({ message, status });
        }
    }
);

export const verifyEmail = createAsyncThunk<
    AuthResponse,
    verifyEmailPayload,
    { rejectValue: AuthError }
>(
    "/auth/verify-email",
    async (
        verifyEmailPayload,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/verify-email',
                verifyEmailPayload,
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "Verification email failed"

            return rejectWithValue({ message, status });
        }
    }
);

export const resendEmail = createAsyncThunk<
    AuthResponse,
    { email: string },
    { rejectValue: AuthError }
>(
    "/auth/resend-email",
    async (
        email,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/resend-email',
                { email: email },
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "resend email failed"

            return rejectWithValue({ message, status });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthResponse | null>) => {
            state.user = action.payload;
        },
        resetError(state) {
            state.error = null;
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
                state.error = action.payload?.message;
                state.status = action.payload?.status;
            })

            // Verify Email
            .addCase(verifyEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message;
                state.status = action.payload?.status;
            })

            // Resend Email
            .addCase(resendEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resendEmail.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(resendEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message;
                state.status = action.payload?.status;
            })
    }
})

export const { setUser, resetError } = authSlice.actions;
export default authSlice.reducer;