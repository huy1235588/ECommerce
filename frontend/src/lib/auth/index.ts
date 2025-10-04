import { STORAGE_KEYS } from '@/lib/constants';

export interface JWTPayload {
    sub: string;
    username: string;
    email: string;
    roles: string[];
    iat: number;
    exp: number;
}

// JWT token utilities
export class TokenService {
    static setTokens(accessToken: string, refreshToken?: string) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        if (refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }
    }

    static getAccessToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    static clearTokens() {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    static decodeToken(token: string): JWTPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }

    static isTokenExpired(token: string): boolean {
        const payload = this.decodeToken(token);
        if (!payload) return true;

        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    }

    static isAuthenticated(): boolean {
        const token = this.getAccessToken();
        return token ? !this.isTokenExpired(token) : false;
    }
}

// Permission utilities
export class PermissionService {
    static hasRole(requiredRole: string, userRoles: string[]): boolean {
        return userRoles.includes(requiredRole);
    }

    static hasAnyRole(requiredRoles: string[], userRoles: string[]): boolean {
        return requiredRoles.some(role => userRoles.includes(role));
    }

    static hasAllRoles(requiredRoles: string[], userRoles: string[]): boolean {
        return requiredRoles.every(role => userRoles.includes(role));
    }
}
