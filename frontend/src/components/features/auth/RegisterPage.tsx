'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { RegisterForm } from './RegisterForm';
import { useAppSelector } from '@/store';

export function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    // Redirect nếu đã đăng nhập
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Register Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Title */}
                    <h2 className="text-3xl text-center font-bold tracking-tight">
                        Tạo tài khoản mới
                    </h2>

                    {/* Register Form */}
                    <div className="mt-8">
                        <RegisterForm />
                    </div>
                </div>
            </div>

            {/* Right Side - Benefits Banner */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/90 to-primary items-center justify-center p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg text-primary-foreground space-y-8">

                </div>
            </div>
        </div>
    );
}
