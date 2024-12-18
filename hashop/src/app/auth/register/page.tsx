'use client'

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetError } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config/auth";
import Link from "next/link";
import { Typography } from "@mui/material";
import { FormData } from "@/types/auth";

import "@/styles/auth.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "@/config/axios";
import Notification from "@/components/common/notification ";

const initialState: FormData = {
    email: "",
    country: "",
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
};

function AuthRegister() {
    const [formData, setFormData] = useState<FormData>(initialState);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [showNotification, setShowNotification] = useState(false);

    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    // Xử lý submit form
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/auth/signup', formData);
            if (response.data.success) {
                setShowNotification(true) // Thông báo thành công
                router.push('/login'); // Chuyển hướng sang trang đăng nhập
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <article className="article">
            <div className="container">
                <aside className="logo-container">
                    <Image className="logo"
                        src="/logo/logo.png"
                        fill={true}
                        sizes="(max-width: 768px) 5rem, (max-width: 1200px) 7rem"
                        alt="logo" />
                </aside>

                {/* Content */}
                <main className="main">
                    <h1 className="heading">
                        Sign up
                    </h1>

                    <CommonForm
                        formControl={registerFormControls}
                        buttonText="Create Account"
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                        isError={error}
                    />

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Already have an account?{" "}
                        <Link
                            className="link"
                            href="/auth/login"
                            onClick={() => dispatch(resetError())}
                        >
                            Login
                        </Link>
                    </Typography>
                </main>
            </div>

            {showNotification && (
                <Notification
                    message="Registration successful!"
                    type="success"
                    duration={300000} // Tự động đóng sau 3 giây
                    onClose={() => setShowNotification(false)} // Đóng thông báo
                />
            )}
        </article>
    );
}

export default AuthRegister;
