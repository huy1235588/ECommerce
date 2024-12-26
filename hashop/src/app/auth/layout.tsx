'use client'

import Notification from "@/components/common/notification ";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) {
    const { auth, setAuth } = useAuth();

    return (
        <article className="article">
            <div className="container">
                {/* Logo */}
                <div className="logo-container">
                    <Image className="logo"
                        src="/logo/logo.png"
                        fill={true}
                        sizes="(max-width: 768px) 5rem, (max-width: 1200px) 7rem"
                        alt="logo" />
                </div>

                {/* Main Content */}
                {children}
            </div>

            {auth.isShowNotification && (
                <Notification
                    message="Registration successful!"
                    type="success"
                    duration={300000} // Tự động đóng sau 3 giây
                    onClose={() => [
                        setAuth({
                            isShowNotification: false
                        })
                    ]} // Đóng thông báo
                />
            )}
        </article>
    );
}
