import { User, UserResponse, UsersResponse } from "@/types";
import { baseApi } from "./base-api";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Lấy thông tin người dùng hiện tại
        getCurrentUser: builder.query<UserResponse, void>({
            query: () => '/users/me',
            providesTags: ['User'],
        }),

        // Cập nhật thông tin người dùng hiện tại
        updateCurrentUser: builder.mutation<UserResponse, Partial<User>>({
            query: (data) => ({
                url: '/users/me',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        // Lấy danh sách người dùng với phân trang và lọc
        getUsers: builder.query<UsersResponse, {
            page?: number;
            size?: number;
            search?: string;
            role?: string;
        }>({
            query: ({ page = 0, size = 100, search = '', role = '' }) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('size', size.toString());
                if (search) params.append('search', search);
                if (role) params.append('role', role);
                return `/users?${params.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        // Tạo người dùng mới
        createUser: builder.mutation<{ data: User }, { name: string; email: string; password: string; role: string }>({
            query: (data) => ({
                url: '/users',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        // Cập nhật người dùng
        updateUser: builder.mutation<{ data: User }, { id: string; name?: string; email?: string; role?: string }>({
            query: ({ id, ...data }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
        }),

        // Xóa người dùng
        deleteUser: builder.mutation<{ message: string }, { id: string }>({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useUpdateCurrentUserMutation,
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;