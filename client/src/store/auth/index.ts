import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { FormDataRegister } from "@/pages/auth/register";
import { FormDataLogin } from "@/pages/auth/login";

interface verifyEmailPayload {
    email: string;
    code: string;
}

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
}

// Định nghĩa AuthSlice
interface AuthSlice {
    user: User | null,
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string | null;
    status?: number;
}

// Khởi tạo trạng thái ban đầu của AuthSlice
const initialState: AuthSlice = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    status: undefined,
}

// Định nghĩa trạng thái phản hồi của api
interface AuthResponse {
    success: boolean,
    message: string,
    status?: number,
    user?: any,
    clientId: string,
}

// Định nghĩa trạng thái lỗi của api
interface AuthError {
    message: string;
    status: number;
}

export const registerUser = createAsyncThunk<
    AuthResponse,
    FormDataRegister,
    { rejectValue: AuthError }
>(
    "/auth/register",
    async (
        formDataRegister,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/signup',
                formDataRegister,
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

export const LoginUser = createAsyncThunk<
    AuthResponse,
    FormDataLogin,
    { rejectValue: AuthError }
>(
    "/auth/login",
    async (
        FormDataLogin,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/login',
                FormDataLogin,
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "login failed"

            return rejectWithValue({ message, status });
        }
    }
);

export const LogoutUser = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: AuthError }
>(
    "/auth/logout",
    async (
        _,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/logout',
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "Error Logout user"

            return rejectWithValue({ message, status });
        }
    }
);

export const ForgotPasswordUser = createAsyncThunk<
    AuthResponse,
    { email: string },
    { rejectValue: AuthError }
>(
    "/auth/forgot-password",
    async (
        email,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/forgot-password',
                email,
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "Error sending reset password email"

            return rejectWithValue({ message, status });
        }
    }
);

export const ForgotPasswordVerifyUser = createAsyncThunk<
    AuthResponse,
    verifyEmailPayload,
    { rejectValue: AuthError }
>(
    "auth/forgot-password/verify",
    async (
        verifyEmailPayload,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/forgot-password/verify',
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
)

export const ResetPasswordUser = createAsyncThunk<
    AuthResponse,
    {
        email: string,
        password: string,
    },
    { rejectValue: AuthError }
>(
    "/auth/reset-password",
    async (
        {
            email,
            password,
        },
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.post(
                '/api/auth/reset-password',
                {
                    email,
                    password,
                },
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "Error sending reset password email"

            return rejectWithValue({ message, status });
        }
    }
);

export const CheckAuthUser = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: AuthError }
>(
    "/auth/check-auth",
    async (
        _,
        { rejectWithValue }
    ) => {
        try {
            const response: AxiosResponse<AuthResponse> = await axios.get(
                '/api/auth/check-auth',
                { withCredentials: true }
            )

            return response.data;

        } catch (error: any) {
            // Lấy status code, nếu không có thì mặc định là 500 (Internal Server Error)
            const status = error.response?.status || 500;
            // Lấy thông báo lỗi từ server
            const message = error.response?.data?.message || "Error sending reset password email"

            return rejectWithValue({ message, status });
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthResponse | null>) => {
            state.user = action.payload?.user;
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

            // Login User
            .addCase(LoginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message;
                state.status = action.payload?.status;
            })

            // Logout User
            .addCase(LogoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.status = action.payload.status;
                } else {
                    state.error = "An unknown error occurred";
                    state.status = 500;
                }
            })

            // Forgot Password
            .addCase(ForgotPasswordUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(ForgotPasswordUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(ForgotPasswordUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message;
                state.status = action.payload?.status;
            })

            // Forgot Password Verify
            .addCase(ForgotPasswordVerifyUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(ForgotPasswordVerifyUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(ForgotPasswordVerifyUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message;
                state.status = action.payload?.status;
            })

            // Reset Password Verify
            .addCase(ResetPasswordUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(ResetPasswordUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(ResetPasswordUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message;
                state.status = action.payload?.status;
            })

            // Check Auth
            .addCase(CheckAuthUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(CheckAuthUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(CheckAuthUser.rejected, (state, action) => {
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