'use client'

import HeaderAdmin from "@/components/admin/headerAdmin";
import SidebarAdmin from "@/components/admin/sidebarAdmin";
import React, { useState } from "react";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Header */}
            <HeaderAdmin
                toggleSidebar={toggleSidebar}
                isOpen={isSidebarOpen}
            />

            {/* Aside */}
            < SidebarAdmin isOpen={isSidebarOpen} />

            {/* Main */}
            <main id="content" className={`main ${isSidebarOpen ? 'open' : 'close'}`} >
                <article className="content">
                    {children}
                </article>
            </main>

        </>
    );
};