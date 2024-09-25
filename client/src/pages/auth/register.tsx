import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useState } from "react";
import { Link } from "react-router-dom";

const initialState = {
    email: "",
    country: "",
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
};

function AuthRegister() {
    const [formData, setFormData] = useState(initialState);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <main className="mmx-auto w-full max-w-md space-y-6">
            <h1 className="text-center text-3xl text-gray-200 font-bold tracking-tight">
                Create Account
            </h1>

            <CommonForm
                formControl={registerFormControls}
                buttonText={'Create Account'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
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