import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/index';
import {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useRefreshTokenMutation,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} from '@/store/api/auth-api';
import {
    clearAuth,
    clearError,
    setUser, selectAuth,
    selectUser,
    selectIsAuthenticated,
    selectIsLoading,
    selectError
} from '@/store/slices/auth/auth-slice';
import { LoginFormData, RegisterFormData } from '@/types/api/auth';
import { cookieUtils } from '@/lib';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(selectAuth);
    const user = useAppSelector(selectUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const error = useAppSelector(selectError);

    // RTK Query mutations
    const [loginMutation, loginResult] = useLoginMutation();
    const [registerMutation, registerResult] = useRegisterMutation();
    const [logoutMutation, logoutResult] = useLogoutMutation();
    const [refreshTokenMutation, refreshResult] = useRefreshTokenMutation();
    const [changePasswordMutation, changePasswordResult] = useChangePasswordMutation();
    const [forgotPasswordMutation, forgotPasswordResult] = useForgotPasswordMutation();
    const [resetPasswordMutation, resetPasswordResult] = useResetPasswordMutation();

    // Profile query
    const {
        data: profileData,
        isLoading: isProfileLoading,
        error: profileError,
        refetch: refetchProfile
    } = useGetProfileQuery(undefined, {
        skip: !isAuthenticated || !auth.token,
    });

    // Login function
    const login = useCallback(async (credentials: LoginFormData) => {
        try {
            const result = await loginMutation(credentials).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [loginMutation]);

    // Register function
    const register = useCallback(async (userData: RegisterFormData) => {
        try {
            const result = await registerMutation(userData).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [registerMutation]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await logoutMutation().unwrap();
        } catch (error) {
            // Even if server logout fails, clear local state
            console.error('Logout error:', error);
        } finally {
            dispatch(clearAuth());
        }
    }, [logoutMutation, dispatch]);

    // Refresh token function
    const refreshToken = useCallback(async (refreshTokenValue: string) => {
        try {
            const result = await refreshTokenMutation(refreshTokenValue).unwrap();
            return result;
        } catch (error) {
            dispatch(clearAuth());
            throw error;
        }
    }, [refreshTokenMutation, dispatch]);

    // Change password function
    const changePassword = useCallback(async (data: {
        currentPassword: string;
        newPassword: string
    }) => {
        try {
            const result = await changePasswordMutation(data).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [changePasswordMutation]);

    // Forgot password function
    const forgotPassword = useCallback(async (email: string) => {
        try {
            const result = await forgotPasswordMutation({ email }).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [forgotPasswordMutation]);

    // Reset password function
    const resetPassword = useCallback(async (token: string, password: string) => {
        try {
            const result = await resetPasswordMutation({ token, password }).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [resetPasswordMutation]);

    // Initialize auth state on app load
    const initializeAuth = useCallback(async () => {
        try {
            // get refresh token from local storage or cookie if needed
            const refreshTokenString = cookieUtils.get('refreshToken');

            if (refreshTokenString) {
                // Refetch user profile to update state
                await refreshToken(refreshTokenString);
            }

        } catch (error) {
            console.error('Failed to initialize auth:', error);
            dispatch(clearAuth());
        }
    }, []);

    // Clear error function
    const clearAuthError = useCallback(() => {
        dispatch(clearError());
        // RTK Query mutations will be cleared when component unmounts or new mutations are triggered
    }, [dispatch]);

    // Update user profile in state
    const updateUserProfile = useCallback((userData: any) => {
        dispatch(setUser(userData));
    }, [dispatch]);

    return {
        // State
        user,
        isAuthenticated,
        isLoading: isLoading || isProfileLoading,
        error: error || profileError, // Only show slice errors and profile errors
        token: auth.token,

        // Actions
        login,
        register,
        logout,
        refreshToken,
        changePassword,
        forgotPassword,
        resetPassword,
        initializeAuth,
        clearError: clearAuthError,
        updateUserProfile,
        refetchProfile,

        // Loading states
        isLoginLoading: loginResult.isLoading,
        isRegisterLoading: registerResult.isLoading,
        isLogoutLoading: logoutResult.isLoading,
        isRefreshLoading: refreshResult.isLoading,
        isChangePasswordLoading: changePasswordResult.isLoading,
        isForgotPasswordLoading: forgotPasswordResult.isLoading,
        isResetPasswordLoading: resetPasswordResult.isLoading,

        // Results with individual errors
        loginResult,
        registerResult,
        logoutResult,
        refreshResult,
        changePasswordResult,
        forgotPasswordResult,
        resetPasswordResult,

        // Individual errors for specific contexts
        loginError: loginResult.error,
        registerError: registerResult.error,
    };
};
