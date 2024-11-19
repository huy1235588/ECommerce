import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ForgotPasswordUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { validateEmail } from "@/utils/formatInput";
import { useRef, useState } from "react";
import { BiSolidXCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()
    const { status, isLoading, error } = useSelector((state: RootState) => state.auth);

    const [formatInput, setFormatInput] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isValidOnChange, setIsValidOnchange] = useState("f");
    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const resultAction = await dispatch(ForgotPasswordUser({
            email: inputValue,
        }));
        const payload = resultAction.payload as { success: boolean, message: string } | null;

        if (resultAction.meta.requestStatus === "fulfilled" && payload?.success) {
            navigate("/auth/forgot-password/verify", {
                state: {
                    email: inputValue,
                }
            });
        }
    };

    return (
        <main className="mmx-auto w-full max-w-md space-y-3">
            <h1 className="text-center text-3xl text-gray-200 font-bold tracking-tight">
                Reset your password
            </h1>

            {error && status === 404 && (
                <p className="flex items-center mb-5 p-5 rounded-md bg-gray-800 text-red-500 outline-none">
                    <BiSolidXCircle className="mr-3" />
                    {error}
                </p>
            )}

            <p className="font-medium">
                Please enter the account you want to retrieve the password
            </p>

            <form className="gap-2" onSubmit={onSubmit}>
                <div className="relative flex flex-wrap justify-between gap-1">
                    <Input
                        id="email"
                        ref={inputRef}
                        type="email"
                        value={inputValue}
                        placeholder=""
                        onChange={(event) => {
                            setInputValue(event.target.value);
                            setIsValidOnchange(validateEmail(event.target.value));
                        }}
                        onBlur={() => setFormatInput(validateEmail(inputValue))}
                        onFocus={() => setFormatInput("")}
                        className={`peer h-16 pl-3 pr-40 pt-7 pb-3 text-lg ${formatInput !== "" ? 'ring-1 ring-red-600 ' : ''}`}
                    />
                    <span className="text-sm text-red-600 min-h-5">
                        {formatInput !== "" ? formatInput : ""}
                    </span>
                    <label
                        className="absolute cursor-text select-none text-gray-500 duration-200 transform -translate-y-0 top-5 z-10 origin-[0] left-4 peer-focus:-translate-y-4 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                        htmlFor="email"
                    >
                        Email Address
                    </label>

                    <p className="absolute h-3/4 right-5 flex items-center">
                        {inputValue !== "" &&
                            <BiSolidXCircle
                                onClick={() => {
                                    setInputValue("");
                                    setIsValidOnchange("f");
                                    inputRef.current?.focus();
                                }}
                                className="text-gray-500 cursor-pointer"
                            />
                        }
                    </p>
                </div>

                <Button
                    type="submit"
                    className="mt-3 py-6 w-full bg-blue-600 text-white hover:bg-blue-500"
                    disabled={isValidOnChange !== ""}
                >
                    CONTINUE
                </Button>

            </form>

            <Button
                type="button"
                className="mt-8 py-6 w-full bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => navigate('/auth/login')}
            >
                BACK TO LOGIN
            </Button>

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

export default ForgotPassword;