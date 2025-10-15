import { Metadata } from 'next';
import { PublicLayout } from '@/components/common';

export const metadata: Metadata = {
    title: 'Dashboard - Admin Panel',
    description: 'Admin dashboard overview and statistics',
};

export default function DashboardPage() {
    return (
        <PublicLayout>
            <div className="space-y-8">
                Trang chủ
            </div>
        </PublicLayout>
    );
}