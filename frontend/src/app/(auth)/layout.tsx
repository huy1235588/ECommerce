import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
    return (
        <>
            <Link
                href="/"
                aria-label="Về trang chủ"
                className="absolute top-5 left-5 flex items-center gap-2 no-underline text-current"
            >
                <Image
                    src="/logos/logo.png"
                    alt="Logo"
                    width={100}
                    height={32}
                />
            </Link>

            {children}
        </>
    );
}
