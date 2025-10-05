import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

interface UserStatsProps {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    adminUsers: number;
}

export function UserStats({
    totalUsers,
    verifiedUsers,
    unverifiedUsers,
    adminUsers,
}: UserStatsProps) {
    const stats = [
        {
            title: "Tổng người dùng",
            value: totalUsers,
            icon: Users,
            description: "Tất cả tài khoản",
            color: "text-blue-500",
        },
        {
            title: "Đã xác thực",
            value: verifiedUsers,
            icon: UserCheck,
            description: "Email đã xác thực",
            color: "text-green-500",
        },
        {
            title: "Chưa xác thực",
            value: unverifiedUsers,
            icon: UserX,
            description: "Cần xác thực email",
            color: "text-yellow-500",
        },
        {
            title: "Quản trị viên",
            value: adminUsers,
            icon: Shield,
            description: "Tài khoản admin",
            color: "text-red-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
