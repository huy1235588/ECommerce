import { ProtectedRoute } from '@/components/features/auth';

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">Trang cá nhân</h1>
                <p>Nội dung chỉ hiển thị khi đã đăng nhập</p>
            </div>
        </ProtectedRoute>
    );
}