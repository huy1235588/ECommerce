import NotFound from "@/app/not-found";
import { checkAuthUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../loadingPage";

interface CheckAuthProps {
    children: React.ReactNode;
}

const CheckAuth: React.FC<CheckAuthProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>(); // Khởi tạo dispatch từ Redux
    const router = useRouter(); // Hook điều hướng của Next.js
    const pathName = usePathname(); // Lấy đường dẫn hiện tại

    // Lấy thông tin người dùng từ Redux store
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // State để theo dõi quá trình kiểm tra xác thực
    const [authChecked, setAuthChecked] = useState(false);

    // Gọi action checkAuthUser khi component được mount
    useEffect(() => {
        // Dispatch action và chờ kết quả
        const checkAuth = async () => {
            await dispatch(checkAuthUser());
            setAuthChecked(true); // Đánh dấu quá trình kiểm tra hoàn tất
        };

        checkAuth(); // Gọi hàm kiểm tra xác thực
    }, [dispatch]);

    // Xử lý điều hướng dựa trên trạng thái xác thực và role
    useEffect(() => {
        if (!authChecked) return; // Chờ kiểm tra xác thực hoàn tất

        // Nếu đã xác thực và là admin mà không phải trang admin
        if (isAuthenticated && user?.role === 'admin' && !pathName.includes('admin')) {
            router.push('/admin/dashboards'); // Chuyển hướng tới dashboard
        }

        // Nếu chưa xác thực và đang truy cập trang admin
        else if (!isAuthenticated && pathName.includes('admin')) {
            router.push('/auth/login'); // Chuyển hướng tới trang đăng nhập
        }

        // Nếu đã xác thực và không phải là admin mà truy cập trang admin
        else if (user?.role !== 'admin' && pathName.includes('admin')) {
            router.push('/not-found'); // Chuyển hướng tới trang "Không tìm thấy"
        }

    }, [authChecked, isAuthenticated, user, pathName, router]);

    // Hiển thị loading
    if (!authChecked) {
       <LoadingPage />;
    }

    // Hiển thị nội dung con nếu không cần điều hướng
    if (!isAuthenticated && pathName.includes('admin')) {
        return null; // Không render gì trong khi đang điều hướng
    }

    if (user?.role !== 'admin' && pathName.includes('admin')) {
        return <NotFound />; // Hiển thị trang "Không tìm thấy"
    }

    return <>{children}</>; // Render nội dung con khi điều kiện thỏa mãn
};

export default CheckAuth;
