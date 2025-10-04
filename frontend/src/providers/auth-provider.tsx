'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/store/hooks/use-auth';
import { User } from '@/types/api/user';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<any>;
    register: (userData: any) => Promise<any>;
    logout: () => Promise<void>;
    clearError: () => void;
    refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const auth = useAuth();

    // Initialize auth on mount
    useEffect(() => {
        auth.initializeAuth();
    }, []);

    const contextValue: AuthContextType = {
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error as string | null,
        login: auth.login,
        register: auth.register,
        logout: auth.logout,
        clearError: auth.clearError,
        refetchProfile: auth.refetchProfile,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
