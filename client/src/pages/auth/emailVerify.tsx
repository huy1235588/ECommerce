import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resendEmail, resetError, verifyEmail } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import maskEmail from "@/utils/email";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidXCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

function EmailVerify() {
    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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

        try {
            const resultAction = await dispatch(verifyEmail({
                email: email,
                code: code,
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
        if (timeLeft !== null) {
            event.preventDefault();
            return;
        }

        dispatch(resetError()); // Reset lại lỗi

        try {
            event.preventDefault();
            const resultAction = await dispatch(resendEmail(email));
            const payload = resultAction.payload as { success: boolean, message: string } | null;

            if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {
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
                Please enter the email verification code to verify your identity
                <span> {maskEmail(email)} </span>
            </p>

            <form className="gap-2" onSubmit={onSubmit}>
                <div className="relative flex flex-wrap justify-between gap-3">
                    <Input
                        id="code"
                        ref={inputRef}
                        type="text"
                        maxLength={6}
                        value={code}
                        placeholder=""
                        onChange={(e) => handleChange(e.target.value)}
                        className="peer h-16 pl-3 pr-40 pt-7 pb-3 text-lg font-bold "
                    />
                    <label
                        className="absolute cursor-text select-none text-gray-500 duration-200 transform -translate-y-0 top-5 z-10 origin-[0] left-4 peer-focus:-translate-y-4 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                        htmlFor="code"
                    >
                        Verification code
                    </label>
                    <p className="absolute h-full right-5 flex items-center">
                        {code !== "" &&
                            <BiSolidXCircle
                                onClick={() => {
                                    setCode("");
                                    setIsFormValid(false);
                                    inputRef.current?.focus();
                                }}
                                className="text-gray-500 cursor-pointer"
                            />
                        }
                        <Link
                            className={`ml-5 cursor-pointer text-blue-500 hover:text-blue-600 select-none ${timeLeft !== null ? 'cursor-not-allowed text-gray-600 hover:text-gray-600' : ''}`}
                            to={`/auth/verify-email?clientId=${clientId}`}
                            onClick={onClickResendEmail}
                        >
                            <span className="border-l-[1px] border-gray-800 mr-3"></span>
                            <span>Send</span>
                            {timeLeft !== null && <span> ({timeLeft})</span>}
                        </Link>
                    </p>
                </div>
                <Button
                    type="submit"
                    className="mt-5 py-6 w-full"
                    disabled={!isFormValid}
                >
                    VERIFY EMAIL
                </Button>
            </form>

            <p className="font-medium">
                Didn't receive the email? Check the spam folder.
                <br />
                <Link
                    className="text-blue-500 hover:underline"
                    to={"/auth/register"}
                    onClick={() => dispatch(resetError())}
                >
                    Change email address
                </Link>
            </p>

            <p className="mt-2">
                Already have an account?
                <Link
                    className="text-blue-500 font-medium ml-2 hover:underline"
                    to="/auth/login"
                    onClick={() => dispatch(resetError())}
                >
                    Login
                </Link>
            </p>

            {isLoading && (
                <div>
                    <p className="absolute top-0 bottom-0 right-0 left-0 bg-black/50 space-y-0"></p>
                    <div className="absolute top-[43%] right-[48%] w-10 h-10 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full opacity-100">
                        <div className="w-6 h-6 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full opacity-100"></div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default EmailVerify;