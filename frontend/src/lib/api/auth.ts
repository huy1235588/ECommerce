import axios from 'axios';
import { LoginFormData, LoginResponse, RegisterFormData } from '@/types/api/auth';
import { cookieUtils } from '@/lib/utils';
import apiClient from '@/lib/api/client';
import { TokenService } from '@/lib/auth';

// Auth API functions
export const authAPI = {
    login: async (data: LoginFormData): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('/auth/login', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Login failed');
            }
            throw new Error('Network error occurred');
        }
    },

    register: async (data: RegisterFormData): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('/auth/register', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Registration failed');
            }
            throw new Error('Network error occurred');
        }
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Ignore logout errors, just clear local storage
            console.warn('Logout API call failed:', error);
        } finally {
            TokenService.clearTokens();
            cookieUtils.remove('refreshToken');
        }
    },

    refreshToken: async (refreshToken: string) => {
        try {
            const response = await apiClient.post('/auth/refresh', {
                refreshToken,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Token refresh failed');
            }
            throw new Error('Network error occurred');
        }
    },
};
