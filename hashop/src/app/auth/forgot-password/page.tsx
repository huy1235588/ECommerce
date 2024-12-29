'use client'

import { useAuth } from "@/context/AuthContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function ForgotPassword() {
    const router = useRouter();

    const { setCurrentStep, setForgotPassword } = useAuth();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Tăng step
        setCurrentStep(2);

        setForgotPassword("af");
        router.push("/auth/forgot-password/verify");
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>
                Please enter the account you want to retrieve the password for
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

            {/* Back to Login */}
            <Button
                fullWidth
                onClick={() => {
                    router.push('/auth/login');
                }}
                variant="contained"
                color="primary"
                type="button"
                className="back-button"
            >
                Back to login
            </Button>
        </form>
    );
}

export default ForgotPassword;