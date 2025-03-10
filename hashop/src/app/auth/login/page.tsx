'use client'

import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config/auth";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { clearError, LoginUser } from "@/store/auth";
import { FormData } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { unwrapResult } from "@reduxjs/toolkit";

const initialState: FormData = {
    email: "",
    password: "",
};

function AuthLogin() {
    const [formData, setFormData] = useState<FormData>(initialState);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { setImageUrl, setPositionAside, setContainerWidth } = useAuth();
    const { notificationDispatch } = useNotification();

    const { isLoading, error, status } = useSelector((state: RootState) => state.auth);
    const email = useSelector((state: RootState) => state.auth.user?.email);

    useEffect(() => {
        setImageUrl('/image/banner/elden-ring-2.jpg');
        setPositionAside('left');
        setContainerWidth('w-35');

        setFormData({
            email: email ? email : "",
        })
    }, [setImageUrl, setPositionAside, setContainerWidth, email]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(LoginUser(formData));

            if (resultAction.meta.requestStatus === "fulfilled") {
                // tạo Id duy nhất
                const id = uuidv4();

                const userResult = unwrapResult(resultAction).user;

                // Thông báo thành công
                notificationDispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        id: id,
                        type: "success",
                        message: `Welcome ${userResult?.userName}`,
                        duration: 5000
                    }
                });

                router.replace('/');
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <main className="auth-main">
            <h1 className="heading">
                Log in
            </h1>

            <CommonForm
                formControl={loginFormControls}
                buttonText={'Login'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isLoading={isLoading}
                isError={(status === 404) ? error : null}
            />

            <p className="links">
                <Link
                    className="link"
                    href="/auth/forgot-password"
                    onClick={() => dispatch(clearError())}
                >
                    Forgot password?
                </Link>
                <Link
                    className="link"
                    href="/auth/register"
                    onClick={() => dispatch(clearError())}
                >
                    Create account
                </Link>
            </p>
        </main>
    );
}

export default AuthLogin;