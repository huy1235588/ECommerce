'use client'

import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config/auth";
// import { LoginUser, resetError } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { LoginUser, resetError } from "@/store/auth";
import { FormData } from "@/types/auth";
import { useRouter } from "next/navigation";

const initialState: FormData = {
    email: "",
    password: "",
};

function AuthLogin() {
    const [formData, setFormData] = useState<FormData>(initialState);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { isLoading, error, status } = useSelector((state: RootState) => state.auth) || null;

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(LoginUser(formData));

            if (resultAction.meta.requestStatus === "fulfilled") {
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
                    onClick={() => dispatch(resetError())}
                >
                    Forgot password?
                </Link>
                <Link
                    className="link"
                    href="/auth/register"
                    onClick={() => dispatch(resetError())}
                >
                    Create account
                </Link>
            </p>
        </main>
    );
}

export default AuthLogin;