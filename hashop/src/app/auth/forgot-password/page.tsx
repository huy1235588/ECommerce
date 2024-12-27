'use client'

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

function ForgotPassword() {
    const { setImageUrl, setPositionAside } = useAuth();

    useEffect(() => {
        setImageUrl('/image/banner/elden-ring-2.jpg');
        setPositionAside('left');
    }, [setImageUrl, setPositionAside]);

    return (
        <div>
            Forgot
        </div>
    );
}

export default ForgotPassword;