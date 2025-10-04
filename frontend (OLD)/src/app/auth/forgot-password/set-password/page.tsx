'use client'

import CommonForm from "@/components/common/form";
import { resetPasswordControls } from "@/config/auth";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { ResetPasswordUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    password: "",
    rePassword: "",
};

function ForgotPasswordVerify() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error, status } = useSelector((state: RootState) => state.auth);
    const { notificationDispatch } = useNotification();

    const { setNotFoundPage, setCurrentStep } = useAuth();
    const [formData, setFormData] = useState<Record<string, string>>(initialState);

    useEffect(() => {
        const loadCookie = () => {
            // Kiểm tra cookie sau khi đã tải xong
            if (document.cookie.includes("resetToken=")) {
                setCurrentStep(3); // Nếu có token thì chuyển sang bước 3
            } else {
                setNotFoundPage(true); // Nếu không có token, trang không tìm thấy
            }
        };

        // Chạy sau khi component được render
        loadCookie();
    }, [setNotFoundPage, setCurrentStep])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const resultAction = await dispatch(ResetPasswordUser(formData['password']));

            if (resultAction.meta.requestStatus === "fulfilled") {
                // tạo Id duy nhất
                const id = uuidv4();

                // Thông báo thành công
                notificationDispatch({

                    type: "ADD_NOTIFICATION",
                    payload: {
                        id: id,
                        type: "success",
                        message: `Password reset successfully`,
                        duration: 5000
                    }
                });

                router.push("/auth/login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Typography variant="body1">
                Please enter your new password
            </Typography>

            <CommonForm
                formControl={resetPasswordControls}
                buttonText="Complete"
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isError={(status === 404) ? error : null}
            />
        </>
    );
}

export default ForgotPasswordVerify;