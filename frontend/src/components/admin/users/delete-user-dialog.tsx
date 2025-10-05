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

interface DeleteUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteUserDialog({
    user,
    open,
    onOpenChange,
    onConfirm
}: DeleteUserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa người dùng{" "}
                        <strong>{user?.username}</strong>? Hành động này không
                        thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Xóa người dùng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
