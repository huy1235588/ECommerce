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
import { useAppDispatch } from '@/store';
import { authApi } from '@/store/api/auth-api';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { SiGoogle } from '@icons-pack/react-simple-icons';

// Schema validation cho form đăng ký
const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .email('Email không hợp lệ'),
    username: z
        .string()
        .min(1, 'Vui lòng nhập tên đăng nhập')
        .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
        .max(20, 'Tên đăng nhập không được vượt quá 20 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
    firstName: z
        .string()
        .min(1, 'Vui lòng nhập họ')
        .min(2, 'Họ phải có ít nhất 2 ký tự'),
    lastName: z
        .string()
        .min(1, 'Vui lòng nhập tên')
        .min(2, 'Tên phải có ít nhất 2 ký tự'),
    password: z
        .string()
        .min(1, 'Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa')
        .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết thường')
        .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số'),
    confirmPassword: z
        .string()
        .min(1, 'Vui lòng xác nhận mật khẩu'),
    acceptTerms: z
        .boolean()
        .refine(val => val === true, 'Bạn phải đồng ý với điều khoản dịch vụ'),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // RTK Query mutation
    const [register, { isLoading: isSubmitting }] = authApi.useRegisterMutation();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    });

    // Watch password field for strength indicator
    const passwordValue = watch('password');

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            // Loại bỏ confirmPassword và acceptTerms trước khi gửi lên server
            const { confirmPassword, acceptTerms, ...registerData } = data;

            const result = await register(registerData).unwrap();

            if (result.success) {
                toast.success('Đăng ký thành công!', {
                    description: 'Chào mừng bạn đến với ECommerce. Vui lòng đăng nhập để tiếp tục.',
                });

                // Redirect về trang đăng nhập
                router.push('/login');
            } else {
                toast.error('Đăng ký thất bại', {
                    description: result.message || 'Vui lòng kiểm tra lại thông tin đăng ký',
                });
            }
        } catch (error: any) {
            console.error('Register error:', error);

            // Xử lý các lỗi cụ thể từ server
            const errorMessage = error?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';

            if (errorMessage.includes('email')) {
                toast.error('Email đã tồn tại', {
                    description: 'Email này đã được sử dụng. Vui lòng chọn email khác.',
                });
            } else if (errorMessage.includes('username')) {
                toast.error('Tên đăng nhập đã tồn tại', {
                    description: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.',
                });
            } else {
                toast.error('Đăng ký thất bại', {
                    description: errorMessage,
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Email <span className="text-destructive">*</span>
                </label>
                <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    {...registerField('email')}
                    className={errors.email ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                    autoComplete="email"
                />
                {errors.email && (
                    <p className="text-sm text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
                <label
                    htmlFor="username"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Tên đăng nhập <span className="text-destructive">*</span>
                </label>
                <Input
                    id="username"
                    type="text"
                    placeholder="username123"
                    {...registerField('username')}
                    className={errors.username ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                    autoComplete="username"
                />
                {errors.username && (
                    <p className="text-sm text-destructive">
                        {errors.username.message}
                    </p>
                )}
            </div>

            {/* First Name and Last Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label
                        htmlFor="firstName"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Họ <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="firstName"
                        type="text"
                        placeholder="Nguyễn"
                        {...registerField('firstName')}
                        className={errors.firstName ? 'border-destructive' : ''}
                        disabled={isSubmitting}
                        autoComplete="given-name"
                    />
                    {errors.firstName && (
                        <p className="text-sm text-destructive">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="lastName"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Tên <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="lastName"
                        type="text"
                        placeholder="Văn A"
                        {...registerField('lastName')}
                        className={errors.lastName ? 'border-destructive' : ''}
                        disabled={isSubmitting}
                        autoComplete="family-name"
                    />
                    {errors.lastName && (
                        <p className="text-sm text-destructive">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Mật khẩu <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Tạo mật khẩu mạnh"
                        {...registerField('password')}
                        className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                        disabled={isSubmitting}
                        autoComplete="new-password"
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
                {/* Password Strength Indicator */}
                <PasswordStrengthIndicator password={passwordValue || ''} />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
                <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Xác nhận mật khẩu <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        {...registerField('confirmPassword')}
                        className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Accept Terms Checkbox */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        {...registerField('acceptTerms')}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        disabled={isSubmitting}
                    />
                    <label
                        htmlFor="acceptTerms"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Tôi đồng ý với{' '}
                        <a href="/terms" className="text-primary hover:underline">
                            Điều khoản dịch vụ
                        </a>{' '}
                        và{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                            Chính sách bảo mật
                        </a>
                    </label>
                </div>
                {errors.acceptTerms && (
                    <p className="text-sm text-destructive">
                        {errors.acceptTerms.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo tài khoản...
                    </>
                ) : (
                    'Đăng ký'
                )}
            </Button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Hoặc đăng ký với
                    </span>
                </div>
            </div>

            {/* Social Login - Import from existing component */}
            <div className="space-y-3">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => toast.info('Tính năng đang phát triển')}
                >
                    <SiGoogle className="mr-1 h-5 w-5" />
                    Đăng ký với Google
                </Button>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm">
                <span className="text-muted-foreground">Đã có tài khoản? </span>
                <a
                    href="/login"
                    className="text-primary font-medium hover:underline"
                >
                    Đăng nhập ngay
                </a>
            </div>
        </form>
    );
}
