"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho Context
interface AuthContextProps {
    notFoundPage: boolean;
    setNotFoundPage: React.Dispatch<React.SetStateAction<boolean>>;
    imageUrl: string;
    setImageUrl: React.Dispatch<React.SetStateAction<string>>;
    positionAside: "left" | "right";
    setPositionAside: React.Dispatch<React.SetStateAction<"left" | "right">>;
}

// Tạo Context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Tạo Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [notFoundPage, setNotFoundPage] = useState(false);

    const [imageUrl, setImageUrl] = useState("");
    const [positionAside, setPositionAside] = useState<"left" | "right">("left");

    return (
        <AuthContext.Provider value={{
            notFoundPage, setNotFoundPage,
            imageUrl, setImageUrl,
            positionAside, setPositionAside,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
