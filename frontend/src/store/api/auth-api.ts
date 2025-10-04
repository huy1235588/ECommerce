import { ApiResponse } from '@/types';
import { baseApi } from './base-api';
import { LoginResponse, LoginFormData, RegisterFormData, UserResponse } from '@/types/api/auth';
import { User } from '@/types/api/user';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Đăng nhập
        login: builder.mutation<LoginResponse, LoginFormData>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
            transformResponse: (response: LoginResponse) => {
                // Lưu token vào localStorage
                if (response.data?.accessToken) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                }
                return response;
            },
        }),

        // Đăng ký
        register: builder.mutation<UserResponse, RegisterFormData>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),

        // Đăng xuất
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Clear tokens
                    localStorage.removeItem('accessToken');
                    // Clear all cached data
                    dispatch(baseApi.util.resetApiState());
                } catch (error) {
                    console.error('Logout error:', error);
                }
            },
        }),

        // Refresh token
        refreshToken: builder.mutation<string, string>({
            query: (refreshToken) => ({
                url: '/auth/refresh',
                method: 'POST',
                body: { refreshToken },
            }),
            transformResponse: (response: ApiResponse<string>) => {
                // Lưu token mới
                if (response.data) {
                    localStorage.setItem('accessToken', response.data);
                }
                return response.data;
            },
        }),

        // Lấy thông tin profile
        getProfile: builder.query<{ data: User }, void>({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),

        // Verify email
        verifyEmail: builder.mutation<{ message: string }, { token: string }>({
            query: ({ token }) => ({
                url: '/auth/verify-email',
                method: 'POST',
                body: { token },
            }),
        }),

        // Forgot password
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: ({ email }) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),

        // Reset password
        resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
            query: ({ token, password }) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { token, password },
            }),
        }),

        // Change password
        changePassword: builder.mutation<{ message: string }, {
            currentPassword: string;
            newPassword: string
        }>({
            query: (data) => ({
                url: '/auth/change-password',
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

// Export hooks
export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useGetProfileQuery,
    useLazyGetProfileQuery,
    useVerifyEmailMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi;
