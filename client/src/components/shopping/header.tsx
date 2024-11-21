import { LogoutUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ShoppingHeaderProps {
    active: string | undefined; // Nhận trạng thái active từ props
}

const ShoppingHeader: React.FC<ShoppingHeaderProps> = ({ active }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [menuAccount, setMenuAccount] = useState(false);

    const onClickLogout = async () => {
        try {
            await dispatch(LogoutUser());
            location.reload();

        } catch (error) {
            console.log(error);
        }
    }

    const onClickLogin = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        navigate('/auth/login');
    }

    return (
        <header className="sticky top-0 w-full z-10 opacity-95">
            <nav className="flex justify-between items-center max-w-5xl mx-auto h-12">
                <ul className="flex flex-1 items-center w-3/5 h-full">
                    <li className="relative h-full flex">
                        <a href="/shop/home" className="flex items-center justify-center w-full mr-5">
                            <img src="../../logo.png" className="w-16" alt="" />
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

export default ShoppingHeader;