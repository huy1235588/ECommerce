'use client'

import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
// import { LoginUser, resetError } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "@/styles/auth.css";
import Image from "next/image";

export type FormDataLogin = {
    email: string;
    password: string;
}

const initialState: FormDataLogin = {
    email: "",
    password: "",
};

function AuthLogin() {
    const [formData, setFormData] = useState<FormDataLogin>(initialState);
    const dispatch = useDispatch<AppDispatch>();

    const { isLoading, error, status } = useSelector((state: RootState) => state.auth) || null;

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(LoginUser(formData));
            const payload = resultAction.payload as {
                success: boolean,
                message: string,
            } | null;

            if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {
                // navigate("/");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <article className="article">
            <div className="container">
                <aside className="logo-container">
                    <Image className="logo" src="/logo/logo.png" fill={true} alt="logo" />
                </aside>

                {/* Content */}
                <main className="main">
                    <h1 className="heading">
                        Sign In
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
            </div>
        </article>
    );
}

export default AuthLogin;