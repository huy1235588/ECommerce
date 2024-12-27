'use client'

import CheckAuth from "@/components/auth/checkAuth";
import { checkAuthUser } from "@/store/auth";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const dispatch = useDispatch<AppDispatch>();

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(checkAuthUser());
    }, [dispatch]);

    return (
        <CheckAuth
            isAuthentication={isAuthenticated}
            user={user}
        >
            <div>
                {children}
            </div>
        </CheckAuth>
    )
};