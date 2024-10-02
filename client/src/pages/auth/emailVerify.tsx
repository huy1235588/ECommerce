import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resendEmail, resetError, verifyEmail } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import maskEmail from "@/utils/email";
import { findLastIndex } from "@/utils/findLastIndex";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidXCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

function EmailVerify() {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { status, isLoading, error } = useSelector((state: RootState) => state.auth);

    // Kiểm tra nếu location.state tồn tại
    if (!location.state) {
        return <Navigate to={`/site${location.pathname}${location.search}`} />
    }

    const { email, clientId } = location.state;

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const verificationCode = code.join("");

        try {
            const resultAction = await dispatch(verifyEmail({
                email: email,
                code: verificationCode,
            }));
            const payload = resultAction.payload as { success: boolean, message: string } | null;

            if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {
                navigate("/auth/login");
            }

        } catch (error) {
            console.log(error);
        }
    };

    // Sự kiện click gửi lại email
    const onClickResendEmail = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        dispatch(resetError()); // Reset lại lỗi

        try {
            event.preventDefault();
            const resultAction = await dispatch(resendEmail(email));
            const payload = resultAction.payload as { success: boolean, message: string } | null;

            if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {

            }

        } catch (error) {
            console.log(error)
        }
    };

    const onChange = (index: number, value: string) => {
        const newCode = [...code];

        // Kiểm tra nếu giá trị nhập vào không phải là số thì không làm gì
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Trường hợp paste nhiều ký tự vào input
        if (value.length > 1 && index !== 5) {
            const pastedCode = value.slice(0, 6 - index).split("");

            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }

            setCode(newCode);

            const lastFilledIndex = findLastIndex(newCode, (digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;

            const nextInput = inputRefs.current[focusIndex];
            if (nextInput) {
                nextInput.focus();
            }
        }
        // Trường hợp nhập từng ký tự
        else {
            newCode[index] = value;
            setCode(newCode);

            // Di chuyển đến input tiếp theo khi được nhập
            if (value && index < 5) {
                const nextInput = inputRefs.current[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };

    const onKeydown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = inputRefs.current[index - 1];
            if (prevInput != null) {
                prevInput.focus();
            }
        }
    };

    useEffect(() => {
        // Kiểm tra các input đều được nhập
        if (code.every((digit) => digit !== "")) {
            // Tạo một sự kiện submit form
            const submitEvent = new Event("submit", { bubbles: true });
            onSubmit(submitEvent as unknown as React.FormEvent<HTMLFormElement>);
        }
    }, [code]);

    return (
        <main className="mmx-auto w-full max-w-md space-y-6">
            <h1 className="text-center text-3xl text-gray-200 font-bold tracking-tight">
                Please Verify Your Email
            </h1>

            {error && status === 400 && (
                <p className="flex items-center mb-5 p-5 rounded-md bg-gray-800 text-red-500 outline-none">
                    <BiSolidXCircle className="mr-3" />
                    {error}
                </p>
            )}

            <p className="font-medium">
                To complete account setup, you need to verify
                <span> {maskEmail(email)} </span>
                Please check your email then
                enter the security code below.
            </p>

            <form className="flex flex-wrap justify-between gap-3" onSubmit={onSubmit}>
                {code.map((digit, index) => (
                    <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={index !== 5 ? 6 : 1}
                        value={digit}
                        onChange={(e) => onChange(index, e.target.value)}
                        onKeyDown={(e) => onKeydown(index, e)}
                        onFocus={(e) => e.target.select()}
                        className="w-12 h-12 text-center text-2xl font-bold "
                    />
                ))}
                <Button type="submit" className="mt-7 py-6 w-full">
                    {isLoading ? (
                        <div className="w-10 h-10 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                            <div className="w-6 h-6 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                        </div>
                    ) : "VERIFY EMAIL"}
                </Button>
            </form>

            <p>
                Didn't receive the email? Check the spam folder.
                <br />
                <Link
                    className="text-blue-500 font-medium mr-2 hover:underline"
                    to={`/auth/verify-email?clientId=${clientId}`}
                    onClick={onClickResendEmail}
                >
                    Resend request
                </Link>
                or
                <Link
                    className="text-blue-500 font-medium ml-2 hover:underline"
                    to={"/auth/register"}
                >
                    change email address
                </Link>
            </p>

            <p className="mt-2">
                Already have an account?
                <Link
                    className="text-blue-500 font-medium ml-2 hover:underline"
                    to="/auth/login"
                >
                    Login
                </Link>
            </p>

        </main>
    );
}

export default EmailVerify;