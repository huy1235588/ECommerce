'use client'

import { useAuth } from "@/context/AuthContext";
import { Step, StepLabel, Stepper } from "@mui/material";
import React, { useEffect, useState } from "react";

const ForgotPasswordLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) => {
    const { setImageUrl, setPositionAside } = useAuth();
    const [currentStep, setCurrentStep] = useState(2);

    useEffect(() => {
        setImageUrl('/image/banner/elden-ring-2.jpg');
        setPositionAside('left');
    }, [setImageUrl, setPositionAside]);

    const steps = [
        { id: 1, label: 'Enter Account' },
        { id: 2, label: 'Security Verification' },
        { id: 3, label: 'Set Password' },
    ];

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    return (
        <main className="auth-main">
            <h1 className="heading">
                Forgot password?
            </h1>

            {/* Step Progress Bar */}
            <Stepper activeStep={currentStep - 1}
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

            <div>
                {children}
            </div>
        </main >
    )
};

export default ForgotPasswordLayout;