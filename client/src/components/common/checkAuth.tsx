import NotFound from "@/pages/not-found";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface CheckAuthProps {
    isAuthenticated: boolean;
    user: {
        name: string,
        role?: string
    } | null;
    children: React.ReactNode;
}

const CheckAuth: React.FC<CheckAuthProps> = ({
    isAuthenticated,
    user,
    children,
}) => {
    const location = useLocation();

    // Kiểm tra xem đã đăng nhập chưa.
    // Nếu chưa sẽ chuyển hướng đến trang đăng nhập
    if (
        !isAuthenticated &&
        !['login', 'register'].some((path) => location.pathname.includes(path))
    ) {
        return <Navigate to='/auth/login' />;
    }

    // Nếu đã đăng nhặp thì chuyển hướng dựa vào vai trò của người dùng
    if (
        isAuthenticated &&
        ['login', 'register'].some((path) => location.pathname.includes(path))
    ) {
        return user?.role === 'admin'
            ? <Navigate to="/admin/dashboard" /> // Chuyển hướng cho ADMIN
            : <Navigate to="/shop/home" /> // Chuyển hướng cho USER
    }

    // Ngăn người dùng truy cập trang admin
    if (
        isAuthenticated &&
        user?.role !== 'admin' &&
        location.pathname.includes('admin')
    ) {
        return <NotFound />
        // return <Navigate to="/unauth-page" />
    }

    // Ngăn admin truy cập vào trang shopping
    if (
        isAuthenticated &&
        user?.role === 'admin' &&
        location.pathname.includes('shop')
    ) {
        return <NotFound />
    }

    return (
        <>
            {children}
        </>
    )
}

export default CheckAuth;