'use client'

import { useAuth } from "@/context/AuthContext";
import { Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
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
        <>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-container">

                    <Typography variant="body1">
                        Please enter the account you want to retrieve the password for
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
                href="/auth/login"
            // onClick={() => dispatch(clearError())}
            >
                Back to login
            </Link>
        </>
    );
}

export default ForgotPassword;