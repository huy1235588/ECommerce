'use client'
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho một thông báo
interface Notification {
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
}

// Định nghĩa kiểu trạng thái và hành động
interface NotificationState {
    notifications: Notification[];
}

type NotificationAction =
    | { type: "ADD_NOTIFICATION"; payload: Notification }
    | { type: "REMOVE_NOTIFICATION"; payload: string };

// Reducer quản lý trạng thái thông báo
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
    switch (action.type) {
        case "ADD_NOTIFICATION":
            return { ...state, notifications: [...state.notifications, action.payload] };
        case "REMOVE_NOTIFICATION":
            return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) };
        default:
            return state;
    }
};

// Tạo context
const NotificationContext = createContext<{
    notificationState: NotificationState;
    notificationDispatch: React.Dispatch<NotificationAction>;
} | null>(null);

// Tạo provider
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notificationState, notificationDispatch] = useReducer(notificationReducer, { notifications: [] });

    return (
        <NotificationContext.Provider value={{ notificationState, notificationDispatch }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Hook để sử dụng context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
