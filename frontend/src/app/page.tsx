import { Metadata } from 'next';
import { PublicLayout } from '@/components/common';

export const metadata: Metadata = {
    title: 'Dashboard - My Digital Collection',
    description: 'Welcome to My Digital Collection - A digital collection management system.',
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