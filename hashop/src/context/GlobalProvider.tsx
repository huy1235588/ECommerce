import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeContextProvider } from "./ThemeContext";

export default function GlobalProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeContextProvider>
    );
}
