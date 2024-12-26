'use client';

import maskEmail from "@/utils/email";
import { Button, TextField, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidXCircle } from "react-icons/bi";
import "@/styles/auth.css";
import Link from "next/link";

function EmailVerify() {
    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState<number | null>(60);
    const [isFormValid, setIsFormValid] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // const location = useLocation();
    // const navigate = useNavigate();

    // Kiểm tra nếu location.state tồn tại
    // if (!location.state) {
    //     return <Navigate to={`/site${location.pathname}${location.search}`} />
    // }

    // const { email, clientId } = location.state;

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // const resultAction = await dispatch(verifyEmail({
            //     email: email,
            //     code: code,
            // }));
            // const payload = resultAction.payload as { success: boolean, message: string } | null;

            // if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {
            //     navigate("/auth/login");
            // }

        } catch (error) {
            console.log(error);
        }
    };

    // Sự kiện click gửi lại email
    const onClickResendEmail = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (timeLeft !== null) {
            event.preventDefault();
            return;
        }

        try {
            event.preventDefault();
            // const resultAction = await dispatch(resendEmail(email));
            // const payload = resultAction.payload as { success: boolean, message: string } | null;

            // if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {
            //     setTimeLeft(60); // Đặt thời gian đếm ngược là 60 giây
            // }

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

    return (
        <article className="article">
            <div className="container">
                <aside className="logo-container">
                    <Image className="logo"
                        src="/logo/logo.png"
                        fill={true}
                        sizes="(max-width: 768px) 5rem, (max-width: 1200px) 7rem"
                        alt="logo" />
                </aside>

                <main className="main">
                    <h1 className="heading">
                        Please Verify Your Email
                    </h1>

                    {/* {error && status === 400 && (
                        <p className="flex items-center mb-5 p-5 rounded-md bg-gray-800 text-red-500 outline-none">
                            <BiSolidXCircle className="mr-3" />
                            {error}
                        </p>
                    )} */}

                    <p className="info-text">
                        Please enter the email verification code to verify your identity
                        {/* <span> {maskEmail(email)} </span> */}
                    </p>

                    <form className="form" onSubmit={onSubmit}>
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
                                onChange={(e) => handleChange(e.target.value)}
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 6
                                    },
                                }}
                            />

                            <p className="action-form-container">
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
                                        className="link link-resend"
                                        href="/auth/login"
                                    // onClick={() => dispatch(resetError())}
                                    >
                                        <span className="divider"></span>
                                        <span>Send</span>
                                        {/* {timeLeft !== null && <span> ({timeLeft})</span>} */}
                                    </Link>
                                </Typography>
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="verify-button"
                            variant="contained"
                            // disabled={!isFormValid}
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

                    {/* {isLoading && (
                        <div>
                            <p className="absolute top-0 bottom-0 right-0 left-0 bg-black/50 space-y-0"></p>
                            <div className="absolute top-[43%] right-[48%] w-10 h-10 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full opacity-100">
                                <div className="w-6 h-6 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full opacity-100"></div>
                            </div>
                        </div>
                    )} */}
                </main>
            </div>
        </article>
    );
}

export default EmailVerify;