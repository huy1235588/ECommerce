'use client'

import Notification from "@/components/common/notification ";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/auth.css?v=1";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) {
    const { notification, setNotification } = useAuth();
    const pathname = usePathname();
    const isLogin = pathname.includes('login');
    const urlImg = isLogin
        ? "/image/banner/elden-ring-2.jpg"
        : "/image/banner/RedDeadRedemption2.jpg"

    return (
        <article className="article">
            <Image
                className="auth-aside-banner"
                src={urlImg}
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

            <aside className={`auth-aside  ${isLogin ? 'left' : 'right'}`}>
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
