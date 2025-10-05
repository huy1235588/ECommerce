"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, Settings,
    BarChart3,
    Tags,
    ShoppingCart, Building,
    Gamepad2,
    BadgePercent,
    CreditCard,
    RotateCcw,
    Library,
    Headphones,
    TrendingUp,
    UserCheck,
    Shield,
    ImageIcon
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
        title: "TỔNG QUAN",
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
        title: "QUẢN LÝ NỘI DUNG",
        items: [
            {
                title: "Trò chơi",
                url: "/admin/games",
                icon: Gamepad2,
            },
            {
                title: "Thể loại",
                url: "/admin/categories",
                icon: Tags,
            },
            {
                title: "Nhà phát hành",
                url: "/admin/publishers",
                icon: Building,
            },
            {
                title: "Khuyến mãi",
                url: "/admin/promotions",
                icon: BadgePercent,
            },
            {
                title: "Banner & Slide",
                url: "/admin/banners",
                icon: ImageIcon,
            },
        ],
    },
    {
        title: "QUẢN LÝ GIAO DỊCH",
        items: [
            {
                title: "Đơn hàng",
                url: "/admin/orders",
                icon: ShoppingCart,
            },
            {
                title: "Giao dịch",
                url: "/admin/transactions",
                icon: CreditCard,
            },
            {
                title: "Hoàn tiền",
                url: "/admin/refunds",
                icon: RotateCcw,
            },
        ],
    },
    {
        title: "QUẢN LÝ NGƯỜI DÙNG",
        items: [
            {
                title: "Tài khoản",
                url: "/admin/users",
                icon: Users,
            },
            {
                title: "Thư viện game",
                url: "/admin/user-games",
                icon: Library,
            },
            {
                title: "Hỗ trợ",
                url: "/admin/support",
                icon: Headphones,
            },
        ],
    },
    {
        title: "BÁO CÁO & PHÂN TÍCH",
        items: [
            {
                title: "Báo cáo doanh thu",
                url: "/admin/reports/revenue",
                icon: TrendingUp,
            },
            {
                title: "Phân tích game",
                url: "/admin/reports/game-analytics",
                icon: BarChart3,
            },
            {
                title: "Người dùng",
                url: "/admin/reports/user-analytics",
                icon: UserCheck,
            },
        ],
    },
    {
        title: "HỆ THỐNG",
        items: [
            {
                title: "Cài đặt thanh toán",
                url: "/admin/settings/payment",
                icon: CreditCard,
            },
            {
                title: "Cài đặt chung",
                url: "/admin/settings/general",
                icon: Settings,
            },
            {
                title: "Quản trị viên",
                url: "/admin/settings/admins",
                icon: Shield,
            },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();

    return (
        <Sidebar variant="floating" collapsible="icon">
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
                        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                            {group.title}
                        </SidebarGroupLabel>
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
