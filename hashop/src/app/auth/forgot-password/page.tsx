'use client'

import CommonForm from "@/components/common/form";
import { forgotPasswordControls } from "@/config/auth";
import { useAuth } from "@/context/AuthContext";
import { ForgotPasswordUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const initialState = {
    email: "",
};

function ForgotPassword() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error, status } = useSelector((state: RootState) => state.auth);

    const { setCurrentStep } = useAuth();
    const [formData, setFormData] = useState<Record<string, string>>(initialState);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(ForgotPasswordUser(formData['email']));

            if (resultAction.meta.requestStatus === "fulfilled") {
                // Tăng step
                setCurrentStep(2);

                router.push("/auth/forgot-password/verify");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Typography variant="body1">
                Please enter the account you want to retrieve the password for
            </Typography>

            <CommonForm
                formControl={forgotPasswordControls}
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
                href="/auth/login"
            // onClick={() => dispatch(clearError())}
            >
                Back to login
            </Link>
        </>
    );
}

export default ForgotPassword;