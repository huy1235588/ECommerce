import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { UserTableRow } from "./user-table-row";

interface UsersTableProps {
    users: User[];
    isLoading: boolean;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onToggleStatus: (userId: string) => void;
    onChangeRole: (userId: string, role: string) => void;
    onViewDetails: (userId: string) => void;
}

export function UsersTable({
    users,
    isLoading,
    onEdit,
    onDelete,
    onToggleStatus,
    onChangeRole,
    onViewDetails
}: UsersTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh sách người dùng ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Quốc gia</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Đăng nhập lần cuối</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            Không tìm thấy người dùng nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <UserTableRow
                                            key={user.id}
                                            user={user}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            onToggleStatus={onToggleStatus}
                                            onChangeRole={onChangeRole}
                                            onViewDetails={onViewDetails}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
