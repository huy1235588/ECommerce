'use client';

import maskEmail from "@/utils/email";
import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidXCircle } from "react-icons/bi";
import Link from "next/link";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import NotFound from "@/app/not-found";
import axios from "@/config/axios";
import axiosLib from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AccountVerification: React.FC = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState<number | null>(60);
    const [isFormValid, setIsFormValid] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { setNotification } = useAuth();

    const email = useSelector((state: RootState) => state.auth.user?.email);

    // Sự kiện submit form
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const verifyEmailPayload = {
                email: email,
                code: code,
            };

            const response = await axios.post(
                '/api/auth/verify-email',
                verifyEmailPayload,
                { withCredentials: true }
            );

            if (response.data.success) {
                setNotification({
                    notification: {
                        message: "Verification successful!",
                        type: "success",
                        duration: 3000,
                    },
                    isShowNotification: true // Thông báo thành công
                })
                router.push("/auth/login");
            }
            
        } catch (error) {
            if (axiosLib.isAxiosError(error) && error.response) {
                console.log(error);
                setError(error.response.data.message);   
            }
        }
    };

    // Sự kiện click gửi lại email
    const handleResend = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (timeLeft !== null) {
            event.preventDefault();
            return;
        }

        try {
            event.preventDefault();

            // Gọi api
            const response = await axios.post(
                '/api/auth/resend-email',
                { email: email },
                { withCredentials: true }
            );

            if (response.data.success) {
                setTimeLeft(60); // Đặt thời gian đếm ngược là 60 giây
            }

        } catch (error) {
            console.log(error)
        }
    };

    const handleChange = (value: string) => {
        // Kiểm tra nếu giá trị nhập vào không phải là số thì không làm gì
        if (!/^\d*$/.test(value)) {
            return;
        }

        setCode(value)

        // Kiểm tra xem đã nhập đủ 6 số
        if (value.length === 6) {
            setIsFormValid(true);
        }
        else {
            setIsFormValid(false);
        }
    };

    useEffect(() => {
        if (timeLeft === 0) {
            setTimeLeft(null);
            return; // Dừng lại khi thời gian hết
        }

        if (timeLeft !== null) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timer); // Xóa bộ đếm thời gian khi component unmount
        }
    }, [timeLeft]);

    if (email === undefined) {
        return <NotFound />
    }

    return (
        <main className="auth-main">
            <h1 className="heading">
                Please Verify Your Email
            </h1>

            {error && (
                <p className="error-message">
                    <BiSolidXCircle className="mr-3" />
                    {error}
                </p>
            )}

            <p className="info-text">
                Please enter the email verification code to verify your identity
                <span> {maskEmail(email)} </span>
            </p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-container">
                    <TextField
                        className="input-form input-form-code"
                        id="code"
                        fullWidth
                        label="Verification code"
                        ref={inputRef}
                        type="text"
                        value={code}
                        placeholder=""
                        autoComplete="off"
                        onChange={(e) => handleChange(e.target.value)}
                        slotProps={{
                            htmlInput: {
                                maxLength: 6
                            },
                        }}
                    />

                    <div className="action-form-container">
                        {code !== "" &&
                            <BiSolidXCircle
                                onClick={() => {
                                    setCode("");
                                    setIsFormValid(false);
                                    inputRef.current?.focus();
                                }}
                                className="clear-icon"
                            />
                        }

                        <Typography variant="body2">
                            <Link
                                className={`link link-resend ${timeLeft !== null ? "cursor-not-allowed" : ""}`}
                                href="#"
                                onClick={handleResend}
                            >
                                <span className="divider"></span>
                                <span className="link-resend-text">Resend</span>
                                {timeLeft !== null && <span> ({timeLeft})</span>}
                            </Link>
                        </Typography>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="verify-button"
                    variant="contained"
                    disabled={!isFormValid}
                >
                    VERIFY EMAIL
                </Button>
            </form>

            <Typography variant="body2" sx={{ mt: 2 }}>
                Didn&apos;t receive the email? Check the spam folder or{" "}
                <Link
                    className="link"
                    href="/auth/login"
                // onClick={() => dispatch(resetError())}
                >
                    Change email address
                </Link>
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link
                    className="link"
                    href="/auth/login"
                // onClick={() => dispatch(resetError())}
                >
                    Login
                </Link>
            </Typography>
        </main>
    );
}

export default AccountVerification;