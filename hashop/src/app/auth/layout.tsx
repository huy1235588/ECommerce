import Notification from "@/components/common/notification ";
import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
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

            {/* {showNotification && (
                <Notification
                    message="Registration successful!"
                    type="success"
                    duration={300000} // Tự động đóng sau 3 giây
                    onClose={() => setShowNotification(false)} // Đóng thông báo
                />
            )} */}
        </article>
    );
}
