import { z } from 'zod';

export const loginSchema = z.object({
    username: z
        .string()
        .min(2, 'Username phải có ít nhất 2 ký tự')
        .max(50, 'Username không được quá 50 ký tự'),
    password: z
        .string()
        .min(2, 'Password phải có ít nhất 2 ký tự')
        .max(100, 'Password không được quá 100 ký tự'),
    rememberMe: z.boolean().optional(),
});

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(2, 'Username phải có ít nhất 2 ký tự')
            .max(30, 'Username không được quá 30 ký tự')
            .regex(
                /^[a-zA-Z0-9_-]+$/,
                'Username chỉ được chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang'
            ),
        email: z
            .email('Email không hợp lệ')
            .max(100, 'Email không được quá 100 ký tự'),
        firstName: z
            .string()
            .min(1, 'Tên không được để trống')
            .max(50, 'Tên không được quá 50 ký tự'),
        lastName: z
            .string()
            .min(1, 'Họ không được để trống')
            .max(50, 'Họ không được quá 50 ký tự'),
        password: z
            .string()
            .min(2, 'Password phải có ít nhất 2 ký tự')
            .max(100, 'Password không được quá 100 ký tự')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
            ),
        confirmPassword: z.string(),
        acceptTerms: z
            .boolean()
            .superRefine((val, ctx) => {
                if (!val) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Bạn phải đồng ý với điều khoản sử dụng',
                    });
                }
            }),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Mật khẩu xác nhận không khớp',
                path: ['confirmPassword'],
            });
        }
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
