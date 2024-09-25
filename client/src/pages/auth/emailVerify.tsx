import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import maskEmail from "@/utils/email";
import { findLastIndex } from "@/utils/findLastIndex";
import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function EmailVerify() {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const location = useLocation();

    const { clientId } = (location.state )|| {};

    const onSubmit = async () => {


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

    return (
        <main className="mmx-auto w-full max-w-md space-y-6">
            <h1 className="text-center text-3xl text-gray-200 font-bold tracking-tight">
                Please Verify Your Email
            </h1>

            <p className="font-medium">
                To complete account setup, you need to verify
                <span> {maskEmail(clientId)} </span>
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
                <Button type="submit" className="mt-7 w-full">
                    VERIFY EMAIL
                </Button>
            </form>

            <p>
                Didn't receive the email? Check the spam folder.
                <br />
                Resend request or
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