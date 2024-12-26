import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

export default function GlobalProvider({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
