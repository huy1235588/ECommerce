import { Metadata } from 'next';
import { LoginPage as LoginPageComponent } from '@/components/features/auth';

export const metadata: Metadata = {
    title: 'Đăng nhập | ECommerce',
    description: 'Đăng nhập vào tài khoản ECommerce của bạn',
};

interface LoginPageProps {
    searchParams: Promise<{
        redirect?: string;
        message?: string;
        error?: string;
    }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;

    // TODO: Check if user is already authenticated
    // For now, we'll implement client-side check in the component

    const redirectUrl = params.redirect;
    const message = params.message || params.error;

    return <LoginPageComponent />;
}
