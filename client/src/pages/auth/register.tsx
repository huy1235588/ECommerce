import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser, resetError } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    // Xử lý submit form
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(registerUser(formData));
            const payload = resultAction.payload

            // if (payload.message_ids === ) {
            //     navigate(`/auth/verify-email?clientId=${payload.messageId}`, {
            //         state: {
            //             formData: formData,
            //         }
            //     });
            // }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="mmx-auto w-full max-w-md space-y-5">
            <h1 className="mb-5 text-center text-3xl text-gray-200 font-bold tracking-tight">
                Create Account
            </h1>

            <CommonForm
                formControl={registerFormControls}
                buttonText={'Create Account'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isLoading={isLoading}
                isError={error}
            />

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

        </main>
    );
}

export default AuthRegister;