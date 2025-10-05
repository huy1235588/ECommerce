import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import {
    setCurrentUser,
    setSelectedUser,
    clearSelectedUser,
    setLoading,
    setError,
    clearError,
} from '@/store/slices/user-slice';
import { useGetCurrentUserQuery, useUpdateCurrentUserMutation, useGetUsersQuery } from '@/store/api/user-api';
import { userApi } from '@/store/api/user-api';
import { User } from '@/types';

// Hook để lấy current user từ state
export const useCurrentUser = () => {
    return useSelector((state: RootState) => state.user.currentUser);
};

// Hook để lấy selected user từ state
export const useSelectedUser = () => {
    return useSelector((state: RootState) => state.user.selectedUser);
};

// Hook để lấy danh sách users từ state
export const useUsers = () => {
    return useSelector((state: RootState) => state.user.users);
};

// Hook để lấy tổng số users từ state
export const useTotalUsers = () => {
    return useSelector((state: RootState) => state.user.totalUsers);
};

// Hook để lấy loading state
export const useUserLoading = () => {
    return useSelector((state: RootState) => state.user.isLoading);
};

// Hook để lấy error state
export const useUserError = () => {
    return useSelector((state: RootState) => state.user.error);
};

// Hook để dispatch actions
export const useUserActions = () => {
    const dispatch = useDispatch();

    return {
        setCurrentUser: (user: User) => dispatch(setCurrentUser(user)),
        setSelectedUser: (user: User) => dispatch(setSelectedUser(user)),
        clearSelectedUser: () => dispatch(clearSelectedUser()),
        setLoading: (loading: boolean) => dispatch(setLoading(loading)),
        setError: (error: string | null) => dispatch(setError(error)),
        clearError: () => dispatch(clearError()),
    };
};

// Hook kết hợp RTK Query và Redux state
export const useUser = () => {
    const dispatch = useDispatch();
    const { data: currentUserData, isLoading, error, refetch } = useGetCurrentUserQuery();
    const [updateCurrentUser] = useUpdateCurrentUserMutation();

    // Sync RTK Query data với Redux state
    React.useEffect(() => {
        if (currentUserData) {
            dispatch(setCurrentUser(currentUserData.data));
        }
    }, [currentUserData, dispatch]);

    const updateUser = async (userData: Partial<User>) => {
        try {
            dispatch(setLoading(true));
            const result = await updateCurrentUser(userData).unwrap();
            dispatch(setCurrentUser(result.data));
            dispatch(clearError());
        } catch (err: any) {
            dispatch(setError(err.message || 'Update failed'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        currentUser: currentUserData?.data || null,
        isLoading,
        error,
        updateUser,
        refetch, // Thêm refetch để làm mới dữ liệu current user
    };
};

// Hook để lấy tất cả users
export const useAllUsers = () => {
    const { data: usersData, isLoading, error, refetch } = useGetUsersQuery({ size: 100 }); // Lấy tối đa 100 users

    return {
        users: usersData?.data || [],
        total: usersData?.total || 0,
        isLoading,
        error,
        refetch, // Thêm refetch để làm mới dữ liệu
    };
};

// Hook để refresh tất cả user data
export const useRefreshUserData = () => {
    const dispatch = useDispatch();

    const refreshAllUsers = () => {
        // Invalidate tất cả user tags để force refresh
        dispatch(userApi.util.invalidateTags(['User']));
    };

    const refreshCurrentUser = () => {
        // Invalidate current user tag
        dispatch(userApi.util.invalidateTags([{ type: 'User', id: 'me' }]));
    };

    return {
        refreshAllUsers,
        refreshCurrentUser,
    };
};