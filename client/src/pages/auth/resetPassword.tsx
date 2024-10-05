import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordStrengthMeter from "@/components/utils/passwordStrong";
import { RootState } from "@/store/store";
import { getStrongPassword } from "@/utils/formatInput";
import { useRef, useState } from "react";
import { BiSolidHide, BiSolidShow, BiSolidXCircle } from "react-icons/bi";
import { useSelector } from "react-redux";

type validationData = {
    password: boolean;
    confirmPassword: boolean;
}

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordType, setConfirmPasswordType] = useState("");
    const [formatPassword, setFormatPassword] = useState("");
    const [formatConfirmPassword, setFormatConfirmPassword] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { status, error, isLoading } = useSelector((state: RootState) => state.auth);

    // Xác thực các input đã nhập hợp lệ
    const [validationState, setValidationState] = useState<validationData>({
        password: false,
        confirmPassword: false
    });

    // Kiểm tra nếu toàn bộ input hợp lệ
    const isFormValid = Object.values(validationState).every((isValid) => isValid);

    const onSubmit = async () => {

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
                {/* New Password */}
                <div className="relative flex flex-wrap justify-between gap-1">
                    <Input
                        id="password"
                        ref={inputRef}
                        type={passwordType}
                        value={password}
                        placeholder=""
                        onChange={(event) => {
                            // Lấy giá trị của input
                            setPassword(event.target.value);

                            setFormatConfirmPassword(event.target.value !== confirmPassword
                                ? "Passwords do not match"
                                : ""
                            );

                            // Kiểm tra input có hợp lệ không
                            const validInput = getStrongPassword(event.target.value)

                            // Nếu chuỗi rỗng thì gán giá trị true 
                            if (validInput === "") {
                                setValidationState((prevState) => ({
                                    ...prevState,
                                    ["password"]: true,
                                }));
                            }
                            // Trường hợp input không hợp lệ
                            else {
                                setValidationState((prevState) => ({
                                    ...prevState,
                                    ["password"]: false,
                                }));
                            }
                        }}
                        onBlur={() => setFormatPassword(getStrongPassword(password))}
                        onFocus={() => setFormatPassword("")}
                        className={`peer h-16 pl-3 pr-28 pt-7 pb-3 text-lg font-bold ${formatPassword !== "" ? 'ring-1 ring-red-600 ' : ''}`}
                    />

                    <label
                        className="absolute cursor-text select-none text-gray-500 duration-200 transform -translate-y-0 top-5 z-10 origin-[0] left-4 peer-focus:-translate-y-4 peer-focus:scale-[0.7] peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                        htmlFor="password"
                    >
                        New Password
                    </label>

                    <p className="absolute h-full right-5 flex items-center">
                        {password !== "" &&
                            <BiSolidXCircle
                                onClick={() => {
                                    setPassword("");
                                    setValidationState((prevState) => ({
                                        ...prevState,
                                        ["password"]: false,
                                    }));
                                    inputRef.current?.focus();
                                }}
                                className="text-gray-500 cursor-pointer mr-3"
                            />
                        }
                        <button
                            type="button"
                            className=" bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none"
                            onClick={() => {
                                setPasswordType((prevType: string) => (prevType === "password" ? "text" : "password"));
                            }}
                        >
                            {passwordType === "password" ? <BiSolidHide /> : <BiSolidShow />}
                        </button>
                    </p>
                </div>

                {/* Confirm password */}
                <div className="relative flex flex-wrap justify-between gap-1 mt-5">
                    <Input
                        id="confirmPassword"
                        ref={inputRef}
                        type={confirmPasswordType}
                        value={confirmPassword}
                        placeholder=""
                        onChange={(event) => {
                            // Lấy giá trị của input
                            setConfirmPassword(event.target.value);

                            // Kiểm tra input có hợp lệ không
                            const validInput = getStrongPassword(event.target.value)

                            // Nếu chuỗi rỗng thì gán giá trị true 
                            if (validInput === "") {
                                setValidationState((prevState) => ({
                                    ...prevState,
                                    ["confirmPassword"]: true,
                                }));
                            }
                            // Trường hợp input không hợp lệ
                            else {
                                setValidationState((prevState) => ({
                                    ...prevState,
                                    ["confirmPassword"]: false,
                                }));
                            };
                        }}
                        onBlur={() => setFormatConfirmPassword(password !== confirmPassword ? "Passwords do not match" : "")}
                        onFocus={() => setFormatConfirmPassword("")}
                        className={`peer h-16 pl-3 pr-28 pt-7 pb-3 text-lg font-bold ${formatConfirmPassword !== "" ? 'ring-1 ring-red-600 ' : ''}`}
                    />

                    <span className="h-4 text-sm text-red-600 mb-0.5">
                        {formatConfirmPassword}
                    </span>

                    <label
                        className="absolute cursor-text select-none text-gray-500 duration-200 transform -translate-y-0 top-5 z-10 origin-[0] left-4 peer-focus:-translate-y-4 peer-focus:scale-[0.7] peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                        htmlFor="confirmPassword"
                    >
                        Confirm New Password
                    </label>

                    <p className="absolute h-3/4 right-5 flex items-center">
                        {confirmPassword !== "" &&
                            <BiSolidXCircle
                                onClick={() => {
                                    setConfirmPassword("");
                                    setValidationState((prevState) => ({
                                        ...prevState,
                                        ["confirmPassword"]: false,
                                    }));
                                    inputRef.current?.focus();
                                }}
                                className="text-gray-500 cursor-pointer mr-3"
                            />
                        }
                        <button
                            type="button"
                            className=" bg-transparent hover:bg-gray-800 duration-200 py-3 px-3 focus:outline-none border-none"
                            onClick={() => {
                                setConfirmPasswordType((prevType: string) => (prevType === "password" ? "text" : "password"));
                            }}
                        >
                            {confirmPasswordType === "password" ? <BiSolidHide /> : <BiSolidShow />}
                        </button>
                    </p>
                </div>

                <PasswordStrengthMeter password={password} />

                <Button
                    type="submit"
                    className="mt-3 py-6 w-full bg-blue-600 text-white hover:bg-blue-500"
                    disabled={!isFormValid}
                >
                    CREATE NEW PASSWORD
                </Button>

            </form>

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

export default ResetPassword;