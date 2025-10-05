import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminLayoutContent } from "@/components/admin/layout/admin-layout-content";

export const metadata: Metadata = {
    title: "Admin Dashboard - E-Commerce",
    description: "Admin dashboard for managing the e-commerce platform",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
    );
}
