import axios from 'axios';
import { User } from '@/types/api/user';
import apiClient from '@/lib/api/client';

// User API functions
export const userAPI = {
    getUserProfile: async () => {
        try {
            const response = await apiClient.get(`users/profile`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Failed to get user profile');
            }
            throw new Error('Network error occurred');
        }
    },

    updateUserProfile: async (data: Partial<User>) => {
        try {
            const response = await apiClient.put(`users/profile`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Failed to update user profile');
            }
            throw new Error('Network error occurred');
        }
    },
};

