'use client'

import React, { useEffect } from "react";
import "@/styles/components/notification.css";
import { IoIosClose } from "react-icons/io";

interface NotificationProps {
    message: string; // Nội dung thông báo
    type?: "success" | "error" | "info" | "warning"; // Loại thông báo
    duration?: number; // Thời gian tự động đóng (ms)
    maxNotifications?: number; // Số lượng thông báo tối đa
    onClose?: () => void; // Hàm gọi khi thông báo đóng
    style?: React.CSSProperties; // CSS cho thông báo
}

const Notification: React.FC<NotificationProps> = ({
    message,
    type = "info",
    duration,
    onClose,
    style = {},
}) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, duration);

            return () => clearTimeout(timer); // Dọn dẹp timer khi component bị unmount
        }
    }, [duration, onClose]);

    return (
        <div 
            className={`notification ${type}`}
            style={{ ...style }}
        >
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose}>
                    <IoIosClose size={24} />
                </button>
            )}
        </div>
    );
};

export default Notification;
