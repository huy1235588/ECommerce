import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@/types/api/auth';
import { User } from '@/types/api/user';
import { authApi } from '@/store/api/auth-api';
import { TokenService } from '@/lib';

// Khởi tạo trạng thái ban đầu
const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? TokenService.getAccessToken() : null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set user manually
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },

        // Clear auth state
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
            // Clear localStorage
            if (typeof window !== 'undefined') {
                TokenService.clearTokens();
            }
        },

        // Set token manually
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            if (typeof window !== 'undefined') {
                TokenService.setTokens(action.payload);
            }
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Set error
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addMatcher(
                authApi.endpoints.login.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.user = action.payload.data?.user || null;
                    state.token = action.payload.data?.accessToken || null;
                    state.isAuthenticated = !!action.payload.data?.user;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error?.message || 'Login failed';
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                }
            )

            // Register cases
            .addMatcher(
                authApi.endpoints.register.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.register.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                    state.error = null;
                    // Don't auto-login after registration
                }
            )
            .addMatcher(
                authApi.endpoints.register.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error?.message || 'Registration failed';
                }
            )

            // Logout cases
            .addMatcher(
                authApi.endpoints.logout.matchPending,
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                authApi.endpoints.logout.matchFulfilled,
                (state) => {
                    state.user = null;
                    state.token = null;
                    state.isAuthenticated = false;
                    state.isLoading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.logout.matchRejected,
                (state) => {
                    // Even if logout fails on server, clear local state
                    state.user = null;
                    state.token = null;
                    state.isAuthenticated = false;
                    state.isLoading = false;
                }
            )

            // Get profile cases
            .addMatcher(
                authApi.endpoints.getProfile.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.getProfile.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.user = action.payload.data || null;
                    state.isAuthenticated = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.getProfile.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error?.message || 'Failed to fetch user profile';
                    // Don't clear auth on profile fetch failure
                }
            )

            // Refresh token cases
            .addMatcher(
                authApi.endpoints.refreshToken.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.refreshToken.matchFulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.token = action.payload || null;
                    state.isAuthenticated = !!action.payload;
                    state.error = null;
                }
            )
            .addMatcher(
                authApi.endpoints.refreshToken.matchRejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error?.message || 'Token refresh failed';
                    state.token = null;
                    state.isAuthenticated = false;
                    state.user = null;
                }
            );
    },
});

export const {
    clearError,
    setUser,
    clearAuth,
    setToken,
    setLoading,
    setError
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
