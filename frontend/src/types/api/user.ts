//===============================================================
//
//  Model
//

import { ApiListResponse, ApiResponse } from "./common";

//===============================================================
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

//===============================================================
//
//  Request 
//
//===============================================================


//===============================================================
//
//  Response
//
//===============================================================

export interface UserResponse extends ApiResponse<User> { }
export interface UsersResponse extends ApiListResponse<User> { }

//===============================================================
//
//  State
//
//===============================================================