import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeContextProvider } from "./ThemeContext";
import { LoadingProvider } from "./LoadingContext";

export default function GlobalProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                <LoadingProvider>
                    {children}
                </LoadingProvider>
            </AuthProvider>
        </ThemeContextProvider>
    );
}
