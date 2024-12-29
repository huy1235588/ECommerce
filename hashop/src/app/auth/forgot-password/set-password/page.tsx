'use client'

import { useAuth } from "@/context/AuthContext";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function ForgotPasswordVerify() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error, status } = useSelector((state: RootState) => state.auth);
    const email = useSelector((state: RootState) => state.auth.user?.email);

    const { setNotFoundPage, setCurrentStep } = useAuth();

    useEffect(() => {
        if (!email) {
            setNotFoundPage(true);
        }
        else {
            setCurrentStep(3);
        }
    }, [email, setNotFoundPage, setCurrentStep])

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