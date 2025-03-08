'use client'

import HomeHeader from "@/components/home/header";
import NavigationBar from "@/components/home/navigation/navigationBar";
import "@/styles/home.css?v=1";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="root">
            {/* Header */}
            <HomeHeader
                active="ha"
            />

            {/* Navigation */}
            <NavigationBar />

            <main 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    marginTop: '90px',
                    background: 'linear-gradient(to bottom, #1b2838, #000)',
                }}
            >
                {children}
            </main>
        </div>
    );
}
