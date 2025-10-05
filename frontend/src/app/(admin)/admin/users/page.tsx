"use client";

import { useState, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAllUsers } from "@/hooks/api/user-hooks";
import { User } from "@/types";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { UserStats } from "@/components/admin/users/user-stats";
import { PageHeader } from "@/components/admin/users/page-header";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UsersTable } from "@/components/admin/users/users-table";
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/admin/users/delete-user-dialog";
import { exportUsersToCSV, filterUsers } from "@/components/admin/users/user-utils";

export default function UsersPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const { users, isLoading, refetch } = useAllUsers();

    // Tối ưu: Sử dụng useMemo thay vì useEffect + useState
    const filteredUsers = useMemo(() => {
        return filterUsers(users, searchQuery, roleFilter, statusFilter);
    }, [users, searchQuery, roleFilter, statusFilter]);

    // Tối ưu: Các statistics được tính toán bằng useMemo
    const userStats = useMemo(() => ({
        totalUsers: users.length,
        verifiedUsers: users.filter((u) => u.emailVerified).length,
        unverifiedUsers: users.filter((u) => !u.emailVerified).length,
        adminUsers: users.filter((u) => u.roles.includes("ADMIN")).length,
    }), [users]);

    const handleEditUser = useCallback((user: User) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    }, []);

    const handleDeleteUser = useCallback((user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleViewDetails = useCallback((userId: string) => {
        router.push(`/admin/users/${userId}`);
    }, [router]);

    const confirmDeleteUser = useCallback(async () => {
        if (!selectedUser) return;

        try {
            // API call to delete user
            toast({
                title: "Thành công",
                description: `Đã xóa người dùng ${selectedUser.username}`,
            });
            setIsDeleteDialogOpen(false);
            refetch();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể xóa người dùng",
                variant: "destructive",
            });
        }
    }, [selectedUser, toast, refetch]);

    const handleToggleUserStatus = useCallback(async (userId: string) => {
        try {
            // API call to toggle user status
            toast({
                title: "Thành công",
                description: "Đã cập nhật trạng thái người dùng",
            });
            refetch();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật trạng thái",
                variant: "destructive",
            });
        }
    }, [toast, refetch]);

    const handleChangeRole = useCallback(async (userId: string, newRole: string) => {
        try {
            // API call to change user role
            toast({
                title: "Thành công",
                description: "Đã cập nhật vai trò người dùng",
            });
            refetch();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật vai trò",
                variant: "destructive",
            });
        }
    }, [toast, refetch]);

    const handleExportUsers = useCallback(() => {
        exportUsersToCSV(filteredUsers);
    }, [filteredUsers]);

    const handleCreateUser = useCallback(() => {
        setIsCreateDialogOpen(true);
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                onRefresh={refetch}
                onExport={handleExportUsers}
                onCreateUser={handleCreateUser}
            />

            {/* User Statistics */}
            <UserStats
                totalUsers={userStats.totalUsers}
                verifiedUsers={userStats.verifiedUsers}
                unverifiedUsers={userStats.unverifiedUsers}
                adminUsers={userStats.adminUsers}
            />

            {/* Filters and Search */}
            <UserFilters
                searchQuery={searchQuery}
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                onSearchChange={setSearchQuery}
                onRoleFilterChange={setRoleFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {/* Users Table */}
            <UsersTable
                users={filteredUsers}
                isLoading={isLoading}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleUserStatus}
                onChangeRole={handleChangeRole}
                onViewDetails={handleViewDetails}
            />

            {/* Edit User Dialog */}
            <EditUserDialog
                user={selectedUser}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />

            {/* Delete User Dialog */}
            <DeleteUserDialog
                user={selectedUser}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDeleteUser}
            />

            {/* Create User Dialog */}
            <CreateUserDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onUserCreated={refetch}
            />
        </div>
    );
}
