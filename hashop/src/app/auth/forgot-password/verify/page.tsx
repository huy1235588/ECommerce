'use client'

import { useAuth } from "@/context/AuthContext";
import { Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ForgotPasswordVerify() {
    const router = useRouter();

    const { forgotPassword, setNotFoundPage, setCurrentStep, setForgotPassword } = useAuth();

    useEffect(() => {
        if (!forgotPassword) {
            setNotFoundPage(true);
        }
    }, [forgotPassword, setNotFoundPage])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Tăng step
        setCurrentStep(3);

        setForgotPassword("af");
        router.push("/auth/forgot-password/set-password");
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-container">

                    <Typography variant="body1">
                        Please enter the email verification code to verify your identity.
                        <br />
                        {forgotPassword}
                    </Typography>

                    <TextField
                        className={`input-form`}
                        fullWidth
                        variant="outlined"
                        label="Username/email"
                        type="email"
                        // value={value}
                        autoComplete="email"
                    />

                </div>

                {/* Next Button */}
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="submit-button next-button"
                >
                    Next
                </Button>

            </form>
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