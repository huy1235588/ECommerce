export interface User {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    status?: string;
    roles: string[];
    emailVerified: boolean;
    birthDate?: string;
    country?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}