'use client'

import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config/auth";
// import { LoginUser, resetError } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearError, LoginUser } from "@/store/auth";
import { FormData } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const initialState: FormData = {
    email: "",
    password: "",
};

function AuthLogin() {
    const [formData, setFormData] = useState<FormData>(initialState);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { setImageUrl, setNotification, setPositionAside } = useAuth();

    const { user, isLoading, error, status } = useSelector((state: RootState) => state.auth) || null;

    useEffect(() => {
        setImageUrl('/image/banner/elden-ring-2.jpg');
        setPositionAside('left');
    }, [setImageUrl, setPositionAside]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(LoginUser(formData));

            if (resultAction.meta.requestStatus === "fulfilled") {
                // Thông báo thành công
                setNotification({
                    notification: {
                        message: `Welcome ${user?.userName}!`,
                        type: "success",
                        duration: 3000,
                    },
                    isShowNotification: true
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