import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { LoginUser, resetError } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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
                navigate("/");
            }

        } catch (error) {
            console.log(error);
        }
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
                isError={(status === 404) ? error : null}
            />

            <p className="flex justify-between mt-2">
                <Link
                    className="text-blue-300 font-medium ml-2 hover:underline"
                    to="/auth/forgot-password"
                    onClick={() => dispatch(resetError())}
                >
                    Forgot password?
                </Link>
                <Link
                    className="text-blue-300 font-medium ml-2 hover:underline"
                    to="/auth/register"
                    onClick={() => dispatch(resetError())}
                >
                    Create account
                </Link>
            </p>
        </main>
    );
}

export default AuthLogin;