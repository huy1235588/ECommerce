'use client'

import { useAuth } from "@/context/AuthContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ForgotPasswordVerify() {
    const router = useRouter();

    const { forgotPassword, setNotFoundPage } = useAuth();

    useEffect(() => {
        if (!forgotPassword) {
            setNotFoundPage(true);
        }
    }, [forgotPassword, setNotFoundPage])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        router.push("/");
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>
                Set your new password.
            </h2>

            {/* Next Button */}
            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                className="next-button"
            >
                Complete
            </Button>
        </form>
    );
}

export default ForgotPasswordVerify;