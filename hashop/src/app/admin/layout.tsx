'use client'

import HeaderAdmin from "@/components/admin/headerAdmin";
import SidebarAdmin from "@/components/admin/sidebarAdmin";
import React, { useState } from "react";
import "@/styles/admin.css?v=1.0.0";

// Kiểu dữ liệu cho ngôn ngữ
export type Language = {
    id: number;
    name: string;
    code: string;
    src: string;
};

// Mảng các ngôn ngữ
const languages: Language[] = [
    {
        id: 1,
        code: 'en',
        name: 'English',
        src: '/icons/flags/1x1/us.svg',
    },
    {
        id: 2,
        code: 'vn',
        name: 'Vietnamese',
        src: '/icons/flags/1x1/vn.svg',
    },
];


export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // State cho ngôn ngữ được chọn
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

    return (
        <>
            {/* Header */}
            <HeaderAdmin
                toggleSidebar={toggleSidebar}
                isOpen={isSidebarOpen}
                languages={languages}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
            />

            {/* Aside */}
            <SidebarAdmin
                isOpen={isSidebarOpen}
                languages={languages}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
            />

            {/* Main */}
            <main id="content" className={`main ${isSidebarOpen ? 'open' : 'close'}`} >
                <article className="content">
                    {children}
                </article>
            </main>

        </>
    );
};