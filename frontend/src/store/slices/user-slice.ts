import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { userApi } from '@/store/api/user-api';

// Định nghĩa state cho user slice
interface UserState {
    currentUser: User | null;
    selectedUser: User | null;
    users: User[];
    totalUsers: number;
    isLoading: boolean;
    error: string | null;
}

// Khởi tạo trạng thái ban đầu
const initialState: UserState = {
    currentUser: null,
    selectedUser: null,
    users: [],
    totalUsers: 0,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set current user
        setCurrentUser: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload;
        },

        // Set selected user
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },

        // Clear selected user
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Set error
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle RTK Query actions
        builder
            // Lấy thông tin current user
            .addMatcher(userApi.endpoints.getCurrentUser.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(userApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload.data;
            })
            .addMatcher(userApi.endpoints.getCurrentUser.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to fetch current user';
            })

            // Cập nhật thông tin current user
            .addMatcher(userApi.endpoints.updateCurrentUser.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(userApi.endpoints.updateCurrentUser.matchFulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload.data;
            })
            .addMatcher(userApi.endpoints.updateCurrentUser.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to update user';
            })

            // Lấy danh sách users
            .addMatcher(userApi.endpoints.getUsers.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(userApi.endpoints.getUsers.matchFulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.data;
                state.totalUsers = action.payload.pagination.totalElements;
            })
            .addMatcher(userApi.endpoints.getUsers.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || 'Failed to fetch users';
            });
    },
});

export const {
    setCurrentUser,
    setSelectedUser,
    clearSelectedUser,
    setLoading,
    setError,
    clearError,
} = userSlice.actions;

export default userSlice.reducer;