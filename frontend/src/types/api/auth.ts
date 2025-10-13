import { ApiResponse } from "./common";
import { User } from "./user";

//===============================================================
//
//  Request 
//
//===============================================================

export interface LoginFormData {
    usernameOrEmail: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterFormData {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

//===============================================================
//
//  Response
//
//===============================================================

export interface LoginResponse extends ApiResponse<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}> { }

//===============================================================
//
//  State
//
//===============================================================

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}