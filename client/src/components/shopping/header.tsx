import { LogoutUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ShoppingHeader() {
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

    const onClickLogin = (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault();
        navigate('/auth/login');
    }

    return (
        <header className="fixed w-full z-10 opacity-95">
            <nav className="flex  justify-between items-center max-w-5xl mx-auto h-12">
                <ul className="flex items-center w-3/5 h-full">
                    <a href="/shop" className="flex items-center justify-center w-full h-3/5 mr-5">
                        <img src="../../logo.png" className="w-16" alt="" />
                    </a>

                    <button
                        onClick={() => {
                            console.log(user)
                            console.log(`haha: ${isAuthenticated}`)
                        }}
                    >
                        test
                    </button>

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
                            onClick={onClickLogin}
                        >
                            Login
                        </button>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default ShoppingHeader;