import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth";
import { AppDispatch } from "@/store/store";
import { getStrongPassword, requiredInput, validateEmail } from "@/utils/formatInput";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

type FormData = {
    email: string;
    country: string;
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
}

const initialState: FormData = {
    email: "",
    country: "",
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
};

function AuthRegister() {
    const [formData, setFormData] = useState<FormData>(initialState);
    const [isFormValid, setIsFormValid] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Kiểm tra input form hợp lệ
    useEffect(() => {
        const { email, password } = formData;

        const isEmpty = Object.values(formData).some((value) => requiredInput(value));

        if (isEmpty) {
            setIsFormValid(false);
        }
        else if (validateEmail(email) !== "") {
            setIsFormValid(false);
        }
        else if (getStrongPassword(password) !== "") {
            setIsFormValid(false);
        }
        else {
            setIsFormValid(true);
        }

    }, [formData])

    // Xử lý submit form
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(registerUser(formData));
            const payload = resultAction.payload as {
                success: boolean,
                message: string,
                messageId: string,
            } | null;

            if (resultAction.meta.requestStatus === 'fulfilled' && payload?.success) {
                navigate(`/auth/verify-email?clientId=${payload.messageId}`, {
                    state: {
                        formData: formData,
                    }
                });
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="mmx-auto w-full max-w-md space-y-5">
            <h1 className="text-center text-3xl text-gray-200 font-bold tracking-tight">
                Create Account
            </h1>

            <CommonForm
                formControl={registerFormControls}
                buttonText={'Create Account'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isFormValid={isFormValid}
            />

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

export default AuthRegister;