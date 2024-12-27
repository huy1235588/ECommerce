import NotFound from "@/app/not-found";
import { User } from "@/store/auth";
import { usePathname } from "next/navigation";
import React from "react";

interface CheckAuthProps {
    isAuthentication: boolean;
    user: User | null;
    children: React.ReactNode;
}

const CheckAuth: React.FC<CheckAuthProps> = ({
    isAuthentication,
    user,
    children
}) => {
    const pathName = usePathname();

    // Ngăn người dùng truy cập trang Admin
    if (isAuthentication ||
        user?.role !== 'admin' &&
        pathName.includes('admin')
    ) {
        return <NotFound />
    }

    return (
        children
    )
};

export default CheckAuth;