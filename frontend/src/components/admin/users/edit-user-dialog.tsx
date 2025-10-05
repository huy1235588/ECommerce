import { User } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EditUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: () => void;
}

export function EditUserDialog({
    user,
    open,
    onOpenChange,
    onSave
}: EditUserDialogProps) {
    const handleSave = () => {
        if (onSave) {
            onSave();
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin người dùng {user?.username}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">Họ</Label>
                        <Input
                            id="firstName"
                            defaultValue={user?.firstName}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Tên</Label>
                        <Input id="lastName" defaultValue={user?.lastName} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            defaultValue={user?.email}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select defaultValue={user?.roles[0]}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
