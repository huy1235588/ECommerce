// Common API response types
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    timestamp?: string;
}

export interface ApiListResponse<T> {
    success: boolean;
    message?: string;
    data: T[];
    pagination: Pagination;
    timestamp?: string;
}

export interface ApiErrorResponse {
    success: boolean;
    errors?: ErrorDetail;
    timestamp?: string;
}

export interface Pagination {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export interface ErrorDetail {
    code?: string;
    message: string;
    detail?: [{
        field?: string;
        message: string;
        rejectedValue?: string | number | boolean | null;
    }];
    traceId?: string;
}
