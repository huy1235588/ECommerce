"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Mail,
    MapPin,
    Calendar,
    Shield,
    CheckCircle,
    Ban,
    Edit,
    Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface User {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    country: string;
    role: string;
    isVerified: boolean;
    lastLogin: string;
    createdAt: string;
}

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetail();
    }, [userId]);

    const fetchUserDetail = async () => {
        setLoading(true);
        try {
            // Mock data - Replace with actual API call
            const mockUser: User = {
                id: userId,
                email: "john.doe@example.com",
                userName: "johndoe",
                firstName: "John",
                lastName: "Doe",
                country: "USA",
                role: "user",
                isVerified: true,
                lastLogin: new Date().toISOString(),
                createdAt: new Date(2024, 5, 15).toISOString(),
            };
            setUser(mockUser);
        } catch (error) {
            console.error("Failed to fetch user detail:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy người dùng</h1>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                    </Button>
                </div>
            </div>

            {/* User Profile Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl">
                                    {user.firstName} {user.lastName}
                                </CardTitle>
                                <Badge
                                    variant={
                                        user.role === "admin"
                                            ? "destructive"
                                            : "secondary"
                                    }
                                >
                                    {user.role}
                                </Badge>
                                {user.isVerified ? (
                                    <Badge variant="default" className="bg-green-500">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Đã xác thực
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        <Ban className="mr-1 h-3 w-3" />
                                        Chưa xác thực
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-base">
                                @{user.userName}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                Tham gia:{" "}
                                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                Đăng nhập lần cuối:{" "}
                                {new Date(user.lastLogin).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs for additional information */}
            <Tabs defaultValue="activity" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="activity">Hoạt động</TabsTrigger>
                    <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                    <TabsTrigger value="games">Thư viện game</TabsTrigger>
                    <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử hoạt động</CardTitle>
                            <CardDescription>
                                Các hoạt động gần đây của người dùng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            Đăng nhập vào hệ thống
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            2 giờ trước
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            Mua game "Cyberpunk 2077"
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            1 ngày trước
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            Cập nhật thông tin cá nhân
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            3 ngày trước
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử đơn hàng</CardTitle>
                            <CardDescription>
                                Danh sách đơn hàng đã mua
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã đơn</TableHead>
                                        <TableHead>Ngày mua</TableHead>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead>Tổng tiền</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>#12345</TableCell>
                                        <TableCell>15/12/2024</TableCell>
                                        <TableCell>Cyberpunk 2077</TableCell>
                                        <TableCell>599.000 VNĐ</TableCell>
                                        <TableCell>
                                            <Badge variant="default">Hoàn thành</Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>#12344</TableCell>
                                        <TableCell>10/12/2024</TableCell>
                                        <TableCell>The Witcher 3</TableCell>
                                        <TableCell>299.000 VNĐ</TableCell>
                                        <TableCell>
                                            <Badge variant="default">Hoàn thành</Badge>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="games" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thư viện game</CardTitle>
                            <CardDescription>
                                Các game mà người dùng đang sở hữu
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="h-16 w-16 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
                                    <div>
                                        <p className="font-medium">Cyberpunk 2077</p>
                                        <p className="text-sm text-muted-foreground">
                                            Đã chơi: 45 giờ
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="h-16 w-16 rounded bg-gradient-to-br from-green-500 to-yellow-500" />
                                    <div>
                                        <p className="font-medium">The Witcher 3</p>
                                        <p className="text-sm text-muted-foreground">
                                            Đã chơi: 120 giờ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài đặt tài khoản</CardTitle>
                            <CardDescription>
                                Quản lý cài đặt và quyền hạn người dùng
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Vai trò</p>
                                    <p className="text-sm text-muted-foreground">
                                        Quyền truy cập hiện tại
                                    </p>
                                </div>
                                <Badge variant="secondary">{user.role}</Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Trạng thái xác thực</p>
                                    <p className="text-sm text-muted-foreground">
                                        Email đã được xác thực
                                    </p>
                                </div>
                                {user.isVerified ? (
                                    <Badge variant="default" className="bg-green-500">
                                        Đã xác thực
                                    </Badge>
                                ) : (
                                    <Button size="sm">Gửi email xác thực</Button>
                                )}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Khóa tài khoản</p>
                                    <p className="text-sm text-muted-foreground">
                                        Vô hiệu hóa truy cập
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Khóa tài khoản
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
