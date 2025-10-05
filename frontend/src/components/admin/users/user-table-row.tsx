import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Ban, CheckCircle, Edit, Eye, MoreHorizontal, Shield, Trash2 } from "lucide-react";

interface UserTableRowProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onToggleStatus: (userId: string) => void;
    onChangeRole: (userId: string, role: string) => void;
    onViewDetails: (userId: string) => void;
}

const getRoleBadgeVariant = (role: string) => {
    switch (role) {
        case "ADMIN":
            return "destructive";
        case "CUSTOMER":
            return "default";
        default:
            return "secondary";
    }
};

export function UserTableRow({
    user,
    onEdit,
    onDelete,
    onToggleStatus,
    onChangeRole,
    onViewDetails
}: UserTableRowProps) {
    return (
        <TableRow key={user.id}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                            {user.firstName ? user.firstName[0] : ''}
                            {user.lastName ? user.lastName[0] : ''}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            @{user.username}
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.country}</TableCell>
            <TableCell>
                {user.roles.map(role => (
                    <Badge key={role} variant={getRoleBadgeVariant(role)}>
                        {role}
                    </Badge>
                ))}
            </TableCell>
            <TableCell>
                {user.emailVerified ? (
                    <Badge
                        variant="default"
                        className="bg-green-500"
                    >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Đã xác thực
                    </Badge>
                ) : (
                    <Badge variant="secondary">
                        <Ban className="mr-1 h-3 w-3" />
                        Chưa xác thực
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                {user.lastLoginAt ? (
                    new Date(user.lastLoginAt).toLocaleDateString(
                        "vi-VN"
                    )
                ) : (
                    "-"
                )}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            Thao tác
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onEdit(user)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onViewDetails(user.id)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onToggleStatus(user.id)}
                        >
                            {user.emailVerified ? (
                                <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Hủy xác thực
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Xác thực
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onChangeRole(user.id, "admin")}
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            Đặt làm Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(user)}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
