'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
    password: string;
    className?: string;
}

interface PasswordStrength {
    score: number; // 0-4
    label: string;
    color: string;
    bgColor: string;
}

/**
 * Tính toán độ mạnh của mật khẩu
 */
function calculatePasswordStrength(password: string): PasswordStrength {
    if (!password) {
        return {
            score: 0,
            label: 'Không có',
            color: 'text-gray-500',
            bgColor: 'bg-gray-300',
        };
    }

    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    // Tính điểm dựa trên các tiêu chí
    if (checks.length) score++;
    if (checks.lowercase) score++;
    if (checks.uppercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    // Bonus cho mật khẩu dài
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Normalize score to 0-4
    const normalizedScore = Math.min(Math.floor(score / 2), 4);

    const strengthMap: Record<number, Omit<PasswordStrength, 'score'>> = {
        0: {
            label: 'Rất yếu',
            color: 'text-red-600',
            bgColor: 'bg-red-500',
        },
        1: {
            label: 'Yếu',
            color: 'text-orange-600',
            bgColor: 'bg-orange-500',
        },
        2: {
            label: 'Trung bình',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-500',
        },
        3: {
            label: 'Mạnh',
            color: 'text-blue-600',
            bgColor: 'bg-blue-500',
        },
        4: {
            label: 'Rất mạnh',
            color: 'text-green-600',
            bgColor: 'bg-green-500',
        },
    };

    return {
        score: normalizedScore,
        ...strengthMap[normalizedScore],
    };
}

export function PasswordStrengthIndicator({
    password,
    className,
}: PasswordStrengthIndicatorProps) {
    const strength = useMemo(() => calculatePasswordStrength(password), [password]);

    if (!password) {
        return null;
    }

    const widthPercentage = ((strength.score + 1) / 5) * 100;

    return (
        <div className={cn('space-y-2', className)}>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full transition-all duration-300 ease-out',
                        strength.bgColor
                    )}
                    style={{ width: `${widthPercentage}%` }}
                />
            </div>

            {/* Label */}
            <div className="flex items-center justify-between text-xs">
                <span className={cn('font-medium', strength.color)}>
                    Độ mạnh: {strength.label}
                </span>

                {/* Requirements */}
                <div className="flex items-center gap-1 text-muted-foreground">
                    {password.length >= 8 && (
                        <span className="text-green-600">✓ 8+ ký tự</span>
                    )}
                </div>
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Mật khẩu cần có:</p>
                <ul className="space-y-0.5 list-none">
                    <li className={password.length >= 6 ? 'text-green-600' : ''}>
                        {password.length >= 6 ? '✓' : '○'} Ít nhất 6 ký tự
                    </li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                        {/[A-Z]/.test(password) ? '✓' : '○'} Một chữ cái viết hoa
                    </li>
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                        {/[a-z]/.test(password) ? '✓' : '○'} Một chữ cái viết thường
                    </li>
                    <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                        {/[0-9]/.test(password) ? '✓' : '○'} Một chữ số
                    </li>
                </ul>
            </div>
        </div>
    );
}
