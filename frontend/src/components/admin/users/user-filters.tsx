import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFiltersProps {
    searchQuery: string;
    roleFilter: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onRoleFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
}

export function UserFilters({
    searchQuery,
    roleFilter,
    statusFilter,
    onSearchChange,
    onRoleFilterChange,
    onStatusFilterChange
}: UserFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bộ lọc</CardTitle>
                <CardDescription>
                    Tìm kiếm và lọc người dùng theo các tiêu chí
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo tên, email, username..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                    <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả vai trò</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="verified">Đã xác thực</SelectItem>
                            <SelectItem value="unverified">Chưa xác thực</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
