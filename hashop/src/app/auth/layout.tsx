'use client'

import Notification from "@/components/common/notification ";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "@/styles/auth.css?v=1";
import NotFound from "../not-found";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/loadingPage";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) {
    const {
        notFoundPage,
        notification, setNotification,
        imageUrl,
        positionAside,
    } = useAuth();

    const pathname = usePathname();
    const router = useRouter();
    const isLogin = pathname.includes('login');

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (!notFoundPage) {
            setIsValid(true); // Đặt trạng thái hợp lệ
        }
    }, [notFoundPage, router]);

    if (!isValid) {
        return <LoadingPage /> // Loading page
    }

    if (notFoundPage) {
        return <NotFound />
    }

    return (
        <article className="article">
            <Image
                className="auth-aside-banner"
                src={imageUrl || "/placehoder/000_1980x1080.svg"}
                fill={true}
                alt="aside"
            />

            {/* Logo */}
            <div className="logo-container">
                <Link
                    href="/"
                >
                    <Image className="logo"
                        src="/logo/logo.png"
                        width={80}
                        height={32}
                        priority={true}
                        alt="logo" />
                </Link>
            </div>

            <aside className={`auth-aside  ${positionAside}`}>
            </aside>

            {/* Main Content */}
            <div className={`container ${isLogin ? 'login' : 'register'}`}>
                {children}
            </div>

            {/* Thông báo */}
            {notification.isShowNotification && notification.notification && (
                <Notification
                    message={notification.notification.message}
                    type={notification.notification.type}
                    duration={notification.notification.duration}
                    onClose={() => [
                        setNotification({
                            notification: null,
                            isShowNotification: false
                        })
                    ]} // Đóng thông báo
                />
            )}
        </article>
    );
}
