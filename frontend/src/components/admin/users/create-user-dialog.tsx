import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserCreated: () => void;
}

export function CreateUserDialog({
    open,
    onOpenChange,
    onUserCreated,
}: CreateUserDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        country: "",
        password: "",
        role: "user",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // API call to create user
            // await userAPI.createUser(formData);

            toast({
                title: "Thành công",
                description: "Đã tạo người dùng mới thành công",
            });

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                userName: "",
                email: "",
                country: "",
                password: "",
                role: "user",
            });

            onUserCreated();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể tạo người dùng mới",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo người dùng mới</DialogTitle>
                    <DialogDescription>
                        Điền thông tin để tạo tài khoản người dùng mới
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">
                                    Họ <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            firstName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">
                                    Tên <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            lastName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="userName">
                                Tên đăng nhập <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="userName"
                                value={formData.userName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        userName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                Mật khẩu <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-muted-foreground">
                                Mật khẩu phải có ít nhất 6 ký tự
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="country">
                                Quốc gia <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) =>
                                    setFormData({ ...formData, country: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Vai trò</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, role: value })
                                }
                            >
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
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Đang tạo..." : "Tạo người dùng"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
