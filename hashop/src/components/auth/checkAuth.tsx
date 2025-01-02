import NotFound from "@/app/not-found";
import { checkAuthUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

interface CheckAuthProps {
    children: React.ReactNode;
}

const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>(); // Khởi tạo dispatch từ Redux
    const router = useRouter(); // Hook điều hướng của Next.js
    const pathName = usePathname(); // Lấy đường dẫn hiện tại

    // Lấy thông tin người dùng từ Redux store
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Gọi action checkAuthUser khi component được mount
    useEffect(() => {
        dispatch(checkAuthUser());
    }, [dispatch]);

    // Ngăn người dùng chưa đăng nhập truy cập các trang admin
    if (!isAuthenticated && pathName.includes('admin')) {
        router.push('/auth/login'); // Chuyển hướng tới trang đăng nhập
        return null; // Không render gì khi đang điều hướng
    }

    // Ngăn người dùng không phải admin truy cập các trang admin
    if (user?.role !== 'admin' && pathName.includes('admin')) {
        return <NotFound />; // Hiển thị trang "Không tìm thấy"
    }

    // Tự động điều hướng admin từ các trang không phải admin tới dashboard
    if (isAuthenticated && user?.role === 'admin' && !pathName.includes('admin')) {
        router.push('/admin/dashboards'); // Chuyển hướng tới dashboard
        return null; // Không render gì khi đang điều hướng
    }

    return <>{children}</>; // Render nội dung con khi điều kiện thỏa mãn
};

export default CheckAuth;
