import { Button } from "@/components/ui/button";
import { Download, RefreshCw, UserPlus } from "lucide-react";

interface PageHeaderProps {
    onRefresh: () => void;
    onExport: () => void;
    onCreateUser: () => void;
}

export function PageHeader({
    onRefresh,
    onExport,
    onCreateUser
}: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
                <p className="text-muted-foreground">
                    Quản lý tài khoản và phân quyền người dùng
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Làm mới
                </Button>
                <Button variant="outline" onClick={onExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất CSV
                </Button>
                <Button onClick={onCreateUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Thêm người dùng
                </Button>
            </div>
        </div>
    );
}
