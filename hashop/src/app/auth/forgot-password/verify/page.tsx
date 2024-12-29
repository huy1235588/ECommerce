'use client'

import CommonForm from "@/components/common/form";
import { forgotPasswordVerifyControls } from "@/config/auth";
import { useAuth } from "@/context/AuthContext";
import { RootState } from "@/store/store";
import { Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const initialState = {
    code: "",
};

function ForgotPasswordVerify() {
    const router = useRouter();
    const { isLoading, error, status } = useSelector((state: RootState) => state.auth);
    const email = useSelector((state: RootState) => state.auth.user?.email);

    const { setNotFoundPage, setCurrentStep, setForgotPassword } = useAuth();
    const [formData, setFormData] = useState<Record<string, string>>(initialState);

    useEffect(() => {
        if (!email) {
            setNotFoundPage(true);
        }
    }, [email, setNotFoundPage])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Tăng step
        setCurrentStep(3);

        setForgotPassword("af");
        router.push("/auth/forgot-password/set-password");
    };

    return (
        <>
            <Typography variant="body1">
                Please enter the email verification code to verify your identity.
                <br />
                {email}
            </Typography>

            <CommonForm
                formControl={forgotPasswordVerifyControls}
                buttonText="Next"
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isError={(status === 404) ? error : null}
            />

            {/* Back to Login */}
            <Link
                className="link"
                href="/auth/forgot-password"
            // onClick={() => dispatch(clearError())}
            >
                Change email
            </Link>
        </>
    );
}

export default ForgotPasswordVerify;