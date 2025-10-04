'use client'

import LoadingPage from "@/components/loadingPage";
import { useAuth } from "@/context/AuthContext";
import { Step, StepLabel, Stepper } from "@mui/material";
import React, { useEffect, useState } from "react";

const ForgotPasswordLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) => {
    const { setImageUrl, setPositionAside, setContainerWidth, notFoundPage, currentStep } = useAuth();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (!notFoundPage) {
            setIsValid(true); // Đặt trạng thái hợp lệ
            setImageUrl('/image/banner/elden-ring-2.jpg');
            setPositionAside('left');
            setContainerWidth('w-35')
        }
    }, [setImageUrl, setPositionAside, setContainerWidth, notFoundPage]);

    if (!isValid) {
        return <LoadingPage /> // Loading page
    }

    if (notFoundPage) {
        return null
    }


    const steps = [
        {
            id: 1,
            label: 'Enter Account',
            link: '/auth/forgot-password/verify'
        },
        {
            id: 2,
            label: 'Security Verification',
            link: '/auth/forgot-password/set-password'

        },
        {
            id: 3,
            label: 'Set Password',
            link: '/auth/login'
        },
    ];

    return (
        <main className="auth-main">
            <h1 className="heading">
                Forgot password?
            </h1>

            {/* Step Progress Bar */}
            <Stepper activeStep={currentStep ? (currentStep - 1) : undefined}
                alternativeLabel
                sx={{
                    color: 'white'
                }}
            >
                {steps.map((step) => (
                    <Step key={step.id}>
                        <StepLabel className="step-label">
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <div className="forgot-password-container">
                {children}
            </div>
        </main >
    )
};

export default ForgotPasswordLayout;