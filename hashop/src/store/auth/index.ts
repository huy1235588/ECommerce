import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/config/axios";
import axiosLib, { AxiosResponse } from "axios";
import { FormData } from "@/types/auth";

// Định nghĩa kiểu dữ liệu người dùng (User)
export type User = {
    _id?: string;
    email?: string;
    country?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    password?: string;
    isVerified?: boolean;
    role?: string;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
};

// Định nghĩa cấu trúc phản hồi từ API
interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
}

// Định nghĩa cấu trúc lỗi từ API
interface AuthError {
    message: string;
    status: number;
}


// Định nghĩa trạng thái của AuthSlice
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string | null;
    status?: number;
}

// Trạng thái khởi tạo cho AuthSlice
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    status: undefined,
};


// Register
export const RegisterUser = createAsyncThunk<
    AuthResponse,
    FormData,
    { rejectValue: AuthError }
>(
    "/auth/signup",
    async (
        FormData,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/signup',
                FormData,
            );

            return response.data;

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                return rejectWithValue({
                    message: data?.message || "Register failed",
                    status
                });
            }

            return rejectWithValue({
                message: "Unexpected error occurred",
                status: 500
            });
        }
    }
);

// Login
export const LoginUser = createAsyncThunk<
    AuthResponse,
    FormData,
    { rejectValue: AuthError }
>(
    "/auth/login",
    async (
        FormData,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/login',
                FormData,
                { withCredentials: true, }
            );

            return response.data;

        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                return rejectWithValue({
                    message: data?.message || "Authentication check failed",
                    status
                });
            }

            return rejectWithValue({
                message: "Unexpected error occurred",
                status: 500
            });
        }
    }
);

// Logout
export const LogoutUser = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: AuthError }
>(
    "/auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                "/api/auth/logout",
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                return rejectWithValue({
                    message: data?.message || "Authentication check failed",
                    status
                });
            }

            return rejectWithValue({
                message: "Unexpected error occurred",
                status: 500
            });
        }
    }
);

// AsyncThunk kiểm tra xác thực người dùng
export const checkAuthUser = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: AuthError }
>(
    "/auth/check-auth",
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.get(
                "/api/auth/check-auth",
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                return rejectWithValue({
                    message: data?.message || "Authentication check failed",
                    status
                });
            }

            return rejectWithValue({
                message: "Unexpected error occurred",
                status: 500
            });
        }
    }
);

// Tạo Auth Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Xử lý trạng thái đăng ký
            .addCase(RegisterUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(RegisterUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message || null;
                state.status = action.payload?.status;
            })

            // Xử lý trạng thái đăng nhập
            .addCase(LoginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message || null;
                state.status = action.payload?.status;
            })

            // Xử lý trạng thái đăng xuất
            .addCase(LogoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = false;
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message || null;
                state.status = action.payload?.status;
            })

            // Xử lý trạng thái xác thực
            .addCase(checkAuthUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuthUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuthUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message || null;
                state.status = action.payload?.status;
            })
    },
});

// Xuất các action và reducer
export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
