'use client'

import { useAuth } from "@/context/AuthContext";
import { clearError, ForgotPasswordUser, ForgotPasswordVerifyUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { Box, Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiSolidXCircle } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function ForgotPasswordVerify() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error, status } = useSelector((state: RootState) => state.auth);
    const email = useSelector((state: RootState) => state.auth.user?.email);

    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState<number | null>(60);
    const [isFormValid, setIsFormValid] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setNotFoundPage, setCurrentStep } = useAuth();

    useEffect(() => {
        if (!email) {
            setNotFoundPage(true);
        }
        else {
            setCurrentStep(2);
        }
    }, [email, setNotFoundPage, setCurrentStep])

    // Sự kiện click gửi lại email
    const onClickResendEmail = async (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => {
        // Ngừng sự kiện nếu còn thời gian đếm ngược
        if (timeLeft !== null) {
            event.preventDefault();
            return;
        }

        dispatch(clearError()); // Reset lại lỗi

        try {
            event.preventDefault();
            const resultAction = await dispatch(ForgotPasswordUser(email ? email : ""));
            const payload = resultAction.payload as { success: boolean, message: string } | null;

            if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {
                setTimeLeft(60); // Đặt thời gian đếm ngược là 60 giây
            }

        } catch (error) {
            console.log(error)
        }
    };

    // Hàm khi nhập giá trị input
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

    // Xác thực email
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const resultAction = await dispatch(ForgotPasswordVerifyUser({
                email: email ? email : "",
                code: code,
            }));

            if (resultAction.meta.requestStatus === "fulfilled") {
                router.push("/auth/forgot-password/set-password");
            }

        } catch (error) {
            console.log(error);
        }
    };

    // Đếm thời gian gửi lại email
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
        <>
            <Typography variant="body1">
                Please enter the email verification code to verify your identity.
                <br />
                {email}
            </Typography>

            {error && status === 404 && (
                <Typography
                    variant="body1"
                    color="error"
                    className="error-message"
                >
                    {error}
                    <Button className="error-close"
                        variant="text"
                        disableRipple={true}
                        onClick={() => {
                            dispatch(clearError());
                        }}
                    >
                        <IoMdClose />
                    </Button>
                </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} className="form form-verify">
                <Box className="form-container">
                    <TextField
                        id="code"
                        className="input-form"
                        inputRef={inputRef}
                        type="text"
                        value={code}
                        onChange={(e) => handleChange(e.target.value)}
                        label="Verification code"
                        variant="outlined"
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                maxLength: 6
                            }
                        }}
                    />

                    <Box className="action">
                        {code !== "" && (
                            <IconButton
                                className="button-clear"
                                size="small"
                                onClick={() => {
                                    setCode("");
                                    setIsFormValid(false);
                                    inputRef.current?.focus();
                                }}
                            >
                                <BiSolidXCircle />
                            </IconButton>
                        )}

                        <Box className="separate" component="span"></Box>

                        <Button
                            className="button-resend-email"
                            onClick={onClickResendEmail}
                            variant="text"
                            type="button"
                            disabled={timeLeft !== null}
                        >
                            <span className="button-text">
                                Resend
                            </span>
                            {timeLeft !== null && <Box component="span">({timeLeft}s)</Box>}
                        </Button>
                    </Box>
                </Box>

                <Button
                    className="submit-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                >
                    {isLoading ? <CircularProgress size={24} /> : "Next"}
                </Button>
            </Box>

            {/* Back to Login */}
            <Link
                className="link"
                href="/auth/forgot-password"
                onClick={() => {
                    setCurrentStep(1);
                }}
            >
                Change email
            </Link>
        </>
    );
}

export default ForgotPasswordVerify;