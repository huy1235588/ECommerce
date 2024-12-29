'use client'

import { useAuth } from "@/context/AuthContext";
import { Button } from "@mui/material";
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
        <form onSubmit={handleSubmit} className="form">
            <h2>
                Please verify your security question.
            </h2>

            {/* Next Button */}
            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                className="next-button"
            >
                Next
            </Button>
        </form>
    );
}

export default ForgotPasswordVerify;