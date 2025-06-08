import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeContextProvider } from "./ThemeContext";
import { LoadingProvider } from "./LoadingContext";
import { SidebarProvider } from "./SidebarConext";

export default function GlobalProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                <LoadingProvider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </LoadingProvider>
            </AuthProvider>
        </ThemeContextProvider>
    );
}
