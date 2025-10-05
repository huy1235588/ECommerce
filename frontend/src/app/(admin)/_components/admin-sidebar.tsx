"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users,
    Package,
    Settings,
    BarChart3,
    Tags,
    ShoppingCart,
    FileText,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

const menuItems = [
    {
        title: "Tổng quan",
        items: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: LayoutDashboard,
            },
            {
                title: "Thống kê",
                url: "/admin/analytics",
                icon: BarChart3,
            },
        ],
    },
    {
        title: "Quản lý",
        items: [
            {
                title: "Sản phẩm",
                url: "/admin/products",
                icon: Package,
            },
            {
                title: "Đơn hàng",
                url: "/admin/orders",
                icon: ShoppingCart,
            },
            {
                title: "Khách hàng",
                url: "/admin/customers",
                icon: Users,
            },
            {
                title: "Danh mục",
                url: "/admin/categories",
                icon: Tags,
            },
        ],
    },
    {
        title: "Vận hành",
        items: [
            {
                title: "Báo cáo",
                url: "/admin/reports",
                icon: FileText,
            },
        ],
    },
    {
        title: "Hệ thống",
        items: [
            {
                title: "Cài đặt",
                url: "/admin/settings",
                icon: Settings,
            },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className={`flex items-center gap-2 px-1 h-12`}>
                    <SidebarTrigger />

                    {state === "collapsed" ? null : (
                        <Image
                            src="/logos/logo.png"
                            alt="Logo"
                            width={80}
                            height={30}
                            className="rounded ml-3"
                        />
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.url}>
                                                    <Icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <div className="px-2 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    © 2024 E-Commerce Admin
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
