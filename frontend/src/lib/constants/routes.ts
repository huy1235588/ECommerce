// Application routes
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    COLLECTIONS: '/collections',
    DEMO: '/demo',

    // Auth routes
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // API routes
    API: {
        AUTH: {
            LOGIN: '/api/auth/login',
            REGISTER: '/api/auth/register',
            REFRESH: '/api/auth/refresh',
            LOGOUT: '/api/auth/logout',
        },
        USERS: {
            PROFILE: '/api/users/profile',
            UPDATE: '/api/users/update',
        },
        COLLECTIONS: {
            LIST: '/api/collections/',
            CREATE: '/api/collections/',
            UPDATE: (id: string) => `/api/collections/${id}`,
            DELETE: (id: string) => `/api/collections/${id}`,
        },
    },
} as const;
