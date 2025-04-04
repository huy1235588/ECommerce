'use client'

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearError, RegisterUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config/auth";
import Link from "next/link";
import { Typography } from "@mui/material";
import { FormData } from "@/types/auth";
import { v4 as uuidv4 } from "uuid";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import { useNotification } from "@/context/NotificationContext";

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
    const { setImageUrl, setPositionAside, setContainerWidth } = useAuth();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { notificationDispatch } = useNotification();
    const { error, isLoading } = useSelector((state: RootState) => state.auth);

    // Set banner
    useEffect(() => {
        setImageUrl('/image/banner/RedDeadRedemption2.jpg');
        setPositionAside('right');
        setContainerWidth('w-45');
    }, [setImageUrl, setPositionAside, setContainerWidth]);

    // Xử lý submit form
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const resultAction = await dispatch(RegisterUser(formData));

            // Kiểm tra phản hồi api
            if (resultAction.meta.requestStatus === "fulfilled") {
                // tạo Id duy nhất
                const id = uuidv4();

                // Thông báo thành công
                notificationDispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        id: id,
                        type: "success",
                        message: "Registration successful!",
                        duration: 5000
                    }
                });

                router.push('/auth/account_verifications'); // Chuyển hướng sang trang đăng nhập
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="auth-main">
            <h1 className="heading">
                Sign up
            </h1>

            <CommonForm
                formControl={registerFormControls}
                buttonText="Create Account"
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                isLoading={isLoading}
                isError={error}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link
                    className="link"
                    href="/auth/login"
                    onClick={() => dispatch(clearError())}
                >
                    Login
                </Link>
            </Typography>

        </main>
    );
}

export default AuthRegister;