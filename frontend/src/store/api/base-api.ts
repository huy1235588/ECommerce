import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@/lib/constants';
import { TokenService, cookieUtils } from '@/lib';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Base query với authentication và error handling
const baseQuery = fetchBaseQuery({
    baseUrl: `${API_CONFIG.BASE_URL}`,
    timeout: API_CONFIG.TIMEOUT,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = TokenService.getAccessToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('content-type', 'application/json');
        return headers;
    },
});

// Mutex để đảm bảo chỉ có một request refresh token tại một thời điểm
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

// Base query với retry và error handling
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // Đợi nếu đang refresh token
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        })
            .then(() => baseQuery(args, api, extraOptions))
            .catch((error) => {
                return { error: error as FetchBaseQueryError };
            });
    }

    let result = await baseQuery(args, api, extraOptions);

    // Nếu token hết hạn, thử refresh
    if (
        result.error &&
        result.error.status === 401
    ) {
        console.log('Token expired, attempting refresh...');

        // Set flag để các request khác đợi
        isRefreshing = true;

        try {
            // Lấy refresh token từ cookie hoặc localStorage
            let refreshToken: string | null = null;
            if (typeof window !== 'undefined') {
                refreshToken = cookieUtils.get('refreshToken') || TokenService.getRefreshToken();
            }

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // Gọi API refresh token
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                // Lưu token mới
                const newToken = (refreshResult.data as any).data;
                TokenService.setTokens(newToken);

                // Update token trong store
                const { setToken } = await import('../slices/auth-slice');
                api.dispatch(setToken(newToken));

                // Process queue - retry các request đang chờ
                processQueue();

                // Retry request ban đầu với token mới
                result = await baseQuery(args, api, extraOptions);
            } else {
                throw new Error('Refresh token failed');
            }
        } catch (error) {
            console.error('Refresh token error:', error);

            // Clear queue với lỗi
            processQueue(error);

            // Dispatch logout action
            const { clearAuth } = await import('../slices/auth-slice');
            api.dispatch(clearAuth());

            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } finally {
            // Reset flag
            isRefreshing = false;
        }
    }

    return result;
};

// Tạo API slice chính
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'User'
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
