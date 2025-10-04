'use client';

import { useState, useRef, useEffect } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { User } from '@/types/api';
import { useAuth } from '@/store/hooks';

interface MainLayoutProps {
    children: React.ReactNode;
    className?: string;
    showSidebar?: boolean;
    showFooter?: boolean;
    user?: User;
}

export default function MainLayout({
    children,
    className = '',
    showSidebar = true,
    showFooter = true,
    user,
}: MainLayoutProps) {
    const [openSidebar, setOpenSidebar] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const {
        user: defaultUser
    } = useAuth();

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setOpenSidebar(false);
            }
        };

        if (openSidebar) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openSidebar]);

    if (!showSidebar) {
        // Layout without sidebar (for public pages)
        return (
            <div className="min-h-screen bg-background">
                <Header
                    showMobileMenu={false}
                    user={defaultUser}
                />
                <main className="flex-1">
                    <div className={cn('h-full', className)}>
                        {children}
                    </div>
                    {showFooter && <Footer />}
                </main>
            </div>
        );
    }

    return (
        <SidebarProvider
            open={openSidebar}
            onOpenChange={setOpenSidebar}
        >
            <div className="min-h-screen w-full bg-background flex">
                {/* Main Content */}
                <SidebarInset className="flex-1 flex flex-col">
                    {/* Header */}
                    <Header
                        user={defaultUser}
                        showMobileMenu={false}
                        setOpenSidebar={setOpenSidebar}
                    />

                    {/* Content */}
                    <main className="flex-1 overflow-auto">
                        <div className={cn('h-full', className)}>
                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    {showFooter && <Footer />}
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

export function PublicLayout({ children, ...props }: Omit<MainLayoutProps, 'showSidebar' | 'footerVariant'>) {
    return (
        <MainLayout
            {...props}
            showSidebar={false}
            className="container mx-auto px-4 py-6"
        >
            {children}
        </MainLayout>
    );
}

export function FullPageLayout({ children, ...props }: Omit<MainLayoutProps, 'showFooter' | 'className'>) {
    return (
        <MainLayout
            {...props}
            showFooter={false}
            className="h-full"
        >
            {children}
        </MainLayout>
    );
}
