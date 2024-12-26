'use client'
// import { LogoutUser } from "@/store/auth";
import {  useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

interface HomeHeaderProps {
    active: string | undefined; // Nhận trạng thái active từ props để đánh dấu menu nào đang được chọn
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ active }) => {
    const router = useRouter();
    // const dispatch = useAppDispatch();

    // Lấy thông tin người dùng và trạng thái xác thực từ store
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    // Quản lý trạng thái hiển thị menu tài khoản
    const [menuAccount, setMenuAccount] = useState(false);

    // Hàm xử lý đăng xuất
    const onClickLogout = async () => {
        try {
            // Gọi action LogoutUser
            // await dispatch(LogoutUser());
            router.push('/');

        } catch (error) {
            console.log(error);
        }
    };

    // Hàm xử lý đăng nhập
    const onClickLogin = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định
        router.push('/auth/login'); // Điều hướng tới trang đăng nhập
    }

    return (
        <header className="sticky top-0 w-full z-10 opacity-95">
            <nav className="flex justify-between items-center max-w-5xl mx-auto h-12">
                <ul className="flex flex-1 items-center w-3/5 h-full">
                    <li className="relative h-full flex">
                        <a href="/shop/home" className="flex items-center justify-center w-full mr-5">
                            <Image src="/logo/logo.png" width={16} height={16} className="w-16" alt="" />
                        </a>
                    </li>

                    <li className="relative h-full flex">
                        <a href="/shop/home"
                            className={`flex items-center justify-center w-full py-2 px-3
                                ${active === "home" ? "text-green-400 hover:text-green-400" : "text-gray-200 hover:text-gray-400"}
                            `}
                        >
                            <span className="mr-1">
                                STORE
                            </span>
                            <FaAngleDown />
                        </a>
                    </li>

                    <li className="relative h-full flex">
                        <a href="/shop/about"
                            className={`flex items-center justify-center w-full py-2 px-3
                                ${active === "about" ? "text-green-400 hover:text-green-400" : "text-gray-200 hover:text-gray-400"}
                            `}
                        >
                            <span className="mr-1">
                                ABOUT
                            </span>
                            <FaAngleDown />
                        </a>
                    </li>

                    <li className="relative h-full flex">
                        <a href="/shop/home" className="flex items-center justify-center w-full py-2 px-3 text-gray-200 hover:text-gray-400">
                            <span className="mr-1">
                                COMMUNITY
                            </span>
                            <FaAngleDown />
                        </a>
                    </li>

                    <li className="relative h-full flex">
                        <a href="/shop/home" className="flex items-center justify-center w-full py-2 px-3 text-gray-200 hover:text-gray-400">
                            <span className="mr-1">
                                SUPPORT
                            </span>
                            <FaAngleDown />
                        </a>
                    </li>
                </ul>

                <ul className="flex">
                    <li className="relative">
                        {isAuthenticated ? (
                            <div>
                                <button
                                    onClick={() => setMenuAccount(prev => !prev)}
                                >
                                    {user?.userName}
                                </button>

                                {menuAccount && <div>
                                    <button
                                        className="absolute"
                                        onClick={onClickLogout}
                                    >
                                        Logout
                                    </button>
                                </div>}
                            </div>
                        ) : (
                            <button
                                className="py-1 px-3 bg-slate-600 hover:bg-slate-500"
                                onClick={onClickLogin}
                            >
                                Sign in
                            </button>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default HomeHeader;