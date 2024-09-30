import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

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
    status?: number,
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
        setUser: (state, action: PayloadAction<AuthResponse | null>) => { 
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
            .addCase(registerUser.fulfilled, (state, action) => {
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
                state.error = action.error as string;
            })
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;