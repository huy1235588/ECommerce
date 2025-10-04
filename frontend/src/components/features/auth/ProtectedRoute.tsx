'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import NotFound from '@/app/not-found';
import { useAuth } from '@/hooks/api';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 * Component bảo vệ route - Yêu cầu đăng nhập
 * @param children - Nội dung cần bảo vệ
 * @param requireAuth - Có yêu cầu đăng nhập không (mặc định: true)
 * @param redirectTo - Đường dẫn chuyển hướng khi chưa đăng nhập (mặc định: '/login')
 */
export function ProtectedRoute({
    children,
    requireAuth = true,
    redirectTo = '/login',
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    // Hiển thị loading khi đang kiểm tra auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Đang kiểm tra đăng nhập...
                    </p>
                </div>
            </div>
        );
    }

    // Nếu yêu cầu auth nhưng chưa đăng nhập, không hiển thị nội dung
    if (requireAuth && !isAuthenticated) {
        return <NotFound />;
    }

    return <>{children}</>;
}
