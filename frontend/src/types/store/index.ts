import { User } from '../api';

// Store types
export interface RootState {
    auth: AuthState;
    ui: UIState;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface UIState {
    theme: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    isLoading: boolean;
}

// Action types
export interface BaseAction {
    type: string;
    payload?: any;
}

export interface AsyncAction<T = any> {
    pending: () => BaseAction;
    fulfilled: (payload: T) => BaseAction;
    rejected: (error: string) => BaseAction;
}
