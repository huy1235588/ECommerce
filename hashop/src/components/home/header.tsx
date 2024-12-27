'use client'
import { useAppSelector } from "@/store/hooks";
import { Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { UserMenu } from "./userMenu ";

interface HomeHeaderProps {
    active: string | undefined; // Nhận trạng thái active từ props để đánh dấu menu nào đang được chọn
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ active }) => {
    const router = useRouter();

    // Lấy thông tin người dùng và trạng thái xác thực từ store
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    // Hàm xử lý đăng nhập
    const onClickLogin = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định
        router.push('/auth/login'); // Điều hướng tới trang đăng nhập
    }

    return (
        <header className="home-header">
            <nav className="home-nav">
                <ul className="home-menu">
                    <li>
                        <a href="/shop/home" className="logo">
                            <Image src="/logo/logo.png" width={64} height={27} alt="" />
                        </a>
                    </li>

                    <li>
                        <a href="/shop/home" className={`default ${active === "home" ? "active" : ""}`}>
                            <span>STORE</span>
                            <FaAngleDown />
                        </a>
                    </li>

                    <li>
                        <a href="/shop/about" className={`default ${active === "about" ? "active" : ""}`}>
                            <span>ABOUT</span>
                            <FaAngleDown />
                        </a>
                    </li>

                    <li>
                        <a href="/shop/home" className="default">
                            <span>COMMUNITY</span>
                            <FaAngleDown />
                        </a>
                    </li>

                    <li>
                        <a href="/shop/home" className="default">
                            <span>SUPPORT</span>
                            <FaAngleDown />
                        </a>
                    </li>
                </ul>

                <ul className="home-menu">
                    <li>
                        {isAuthenticated ? (
                            <div className="menu-account-container">
                                {user?.userName && (
                                    <UserMenu
                                        username={user.userName}
                                        avatarUrl="/logo/logo.png"
                                    />
                                )}
                            </div>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onClickLogin}
                                sx={{
                                    height: "60%"
                                }}
                            >
                                Sign in
                            </Button>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default HomeHeader;