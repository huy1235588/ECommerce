import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { env } from '@/config/env';

// Base query với authentication và error handling
const baseQuery = fetchBaseQuery({
    baseUrl: `${env.API_URL}`,
    timeout: env.API_TIMEOUT,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('content-type', 'application/json');
        return headers;
    },
});

// Base query với retry và error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);

    // Nếu token hết hạn, thử refresh
    if (result.error && result.error.status === 401) {
        console.log('Token expired, attempting refresh...');

        // Dispatch logout action nếu refresh thất bại
        const { clearAuth } = await import('../slices/auth/auth-slice');
        api.dispatch(clearAuth());

        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    return result;
};

// Tạo API slice chính
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'User',
        'Collection',
        'Item',
        'Category',
        'Tag',
        'Comment',
        'Like',
        'Follow'
    ],
    endpoints: () => ({}),
});

// Export hooks
export const {
    util: { getRunningQueriesThunk },
} = baseApi;

// Export các utility functions
export const {
    invalidateTags,
} = baseApi.util;
