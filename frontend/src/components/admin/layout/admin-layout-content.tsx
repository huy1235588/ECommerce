"use client";

import { AdminSidebar } from "./admin-sidebar";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AdminHeader } from "./admin-header";

export function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { state, toggleSidebar, isMobile } = useSidebar();

    return (
        <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <SidebarInset
                className="flex-1"
                onClick={state === "expanded" && !isMobile ? toggleSidebar : undefined}
            >
                <AdminHeader />
                <main
                    className="flex-1 overflow-auto mx-20 my-4"
                    onClick={state === "expanded" && !isMobile ? toggleSidebar : undefined}
                >
                    {children}
                </main>
            </SidebarInset>
        </div>
    );
}