import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/config/axios";
import axiosLib, { AxiosResponse } from "axios";

// Định nghĩa kiểu dữ liệu người dùng (User)
export type User = {
    _id: string;
    email: string;
    country: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    isVerified: boolean;
    role: string;
    verificationToken: string;
    verificationTokenExpiresAt: Date;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};

// Định nghĩa trạng thái của AuthSlice
interface AuthSlice {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string | null;
    status?: number;
}

// Trạng thái khởi tạo cho AuthSlice
const initialState: AuthSlice = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    status: undefined,
};

// Định nghĩa cấu trúc phản hồi từ API
interface AuthResponse {
    success: boolean;
    message: string;
    status?: number;
    user?: User;
}

// Định nghĩa cấu trúc lỗi từ API
interface AuthError {
    message: string;
    status: number;
}

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
                "/api/auth/check-auth"
            );
            return response.data;
        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                const message = data?.message || "Authentication check failed";
                return rejectWithValue({ message, status });
            }
            return rejectWithValue({ message: "Unexpected error occurred", status: 500 });
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
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
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
            });
    },
});

// Xuất các action và reducer
export const { setUser, resetError } = authSlice.actions;
export default authSlice.reducer;
