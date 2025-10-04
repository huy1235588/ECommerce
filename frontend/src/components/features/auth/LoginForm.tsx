'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store';
import { authApi } from '@/store/api/auth-api';
import { SocialLogin } from './SocialLogin';

// Schema validation cho form đăng nhập
const loginSchema = z.object({
    usernameOrEmail: z
        .string(),
    password: z
        .string(),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { isLoading } = useAppSelector((state) => state.auth);

    // RTK Query mutation
    const [login, { isLoading: isSubmitting }] = authApi.useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            usernameOrEmail: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const result = await login(data).unwrap();

            if (result.success) {
                toast.success('Đăng nhập thành công!', {
                    description: `Chào mừng ${result.data?.user?.firstName || 'bạn'} trở lại!`,
                });

                // Redirect về trang chủ hoặc trang trước đó
                router.push('/');
                router.refresh();
            } else {
                toast.error('Đăng nhập thất bại', {
                    description: result.message || 'Vui lòng kiểm tra lại thông tin đăng nhập',
                });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error('Đăng nhập thất bại', {
                description: error?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username or Email Field */}
            <div className="space-y-2">
                <label
                    htmlFor="usernameOrEmail"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Tên đăng nhập hoặc Email
                </label>
                <Input
                    id="usernameOrEmail"
                    type="text"
                    placeholder="Nhập tên đăng nhập hoặc email"
                    {...register('usernameOrEmail')}
                    className={errors.usernameOrEmail ? 'border-destructive' : ''}
                    disabled={isSubmitting || isLoading}
                    autoComplete="username"
                />
                {errors.usernameOrEmail && (
                    <p className="text-sm text-destructive">
                        {errors.usernameOrEmail.message}
                    </p>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Mật khẩu
                    </label>
                    <a
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                        tabIndex={-1}
                    >
                        Quên mật khẩu?
                    </a>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        {...register('password')}
                        className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                        disabled={isSubmitting || isLoading}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-destructive">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="rememberMe"
                    {...register('rememberMe')}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={isSubmitting || isLoading}
                />
                <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Ghi nhớ đăng nhập
                </label>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoading}
            >
                {isSubmitting || isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng nhập...
                    </>
                ) : (
                    'Đăng nhập'
                )}
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Hoặc đăng nhập với
                    </span>
                </div>
            </div>

            {/* Social Login */}
            <SocialLogin />

            {/* Register Link */}
            <div className="text-center text-sm">
                <span className="text-muted-foreground">Chưa có tài khoản? </span>
                <a
                    href="/register"
                    className="text-primary font-medium hover:underline"
                >
                    Đăng ký ngay
                </a>
            </div>
        </form>
    );
}
