import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { resetError } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

type FormData = {
    email: string;
    password: string;
}

const initialState: FormData = {
    email: "",
    password: "",
};

function AuthLogin() {
    const [formData, setFormData] = useState<FormData>(initialState);
    const dispatch = useDispatch<AppDispatch>();
    
    const { isLoading, error } = useSelector((state: RootState) => state.auth) || null;

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <main className="mmx-auto w-full max-w-md space-y-6">
            <h1 className="text-center text-3xl text-gray-200 font-bold tracking-tight">
                Sign In
            </h1>

            <CommonForm
                formControl={loginFormControls}
                buttonText={'Login'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isLoading={isLoading}
                isError={error}
            />

            <p className="mt-2">
                Don't have an account?
                <Link
                    className="text-blue-500 font-medium ml-2 hover:underline"
                    to="/auth/register"
                    onClick={() => dispatch(resetError())}
                >
                    Register
                </Link>
            </p>
        </main>
    );
}

export default AuthLogin;