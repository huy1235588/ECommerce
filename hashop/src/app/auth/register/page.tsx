'use client'

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetError, setUser, User } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config/auth";
import Link from "next/link";
import { Typography } from "@mui/material";
import { FormData } from "@/types/auth";

import "@/styles/auth.css?v=1";
import { useRouter } from "next/navigation";
import axios from "@/config/axios";
import { useAuth } from "@/context/AuthContext";

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
    const { setAuth } = useAuth();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    // Xử lý submit form
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // Gọi api đăng ký
            const response = await axios.post('/api/auth/signup', formData);

            // Kiểm tra phản hồi api
            if (response.data.success) {
                setAuth({
                    isShowNotification: true // Thông báo thành công
                })

                // Truyền dữ liệu
                const data: User = {
                    email: formData.email || undefined,
                }

                dispatch(setUser(data));
                router.push('/auth/account_verifications'); // Chuyển hướng sang trang đăng nhập
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="auth-main">
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
    );
}

export default AuthRegister;