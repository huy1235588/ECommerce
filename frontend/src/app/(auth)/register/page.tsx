import { Metadata } from 'next';
import { RegisterPage as RegisterPageComponent } from '@/components/features/auth';

export const metadata: Metadata = {
    title: 'Đăng ký | ECommerce',
    description: 'Tạo tài khoản ECommerce để bắt đầu mua sắm',
};

interface RegisterPageProps {
    searchParams: Promise<{
        message?: string;
        error?: string;
    }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
    const params = await searchParams;
    const message = params.message || params.error;

    return <RegisterPageComponent />;
}
