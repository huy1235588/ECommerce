'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { SiFacebook, SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';

import { Button } from '@/components/ui/button';

interface SocialProvider {
    id: string;
    name: string;
    icon: React.ReactNode;
    bgColor: string;
}

const socialProviders: SocialProvider[] = [
    {
        id: 'google',
        name: 'Google',
        icon: (<SiGoogle />),
        bgColor: 'bg-[#1877F2]',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: (<SiFacebook />),
        bgColor: 'bg-[#1877F2]',
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: (<SiGithub />),
        bgColor: 'bg-[#1877F2]',
    },
];

interface SocialLoginProps {
    onSuccess?: (provider: string, data: any) => void;
    onError?: (provider: string, error: any) => void;
}

export function SocialLogin({ onSuccess, onError }: SocialLoginProps) {
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    const handleSocialLogin = async (providerId: string) => {
        setLoadingProvider(providerId);

        try {
            // TODO: Implement actual OAuth flow
            // For now, this is a placeholder
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.info(`Đăng nhập với ${providerId}`, {
                description: 'Tính năng đang được phát triển',
            });

            // Mock success callback
            if (onSuccess) {
                onSuccess(providerId, { message: 'Success' });
            }
        } catch (error) {
            console.error(`${providerId} login error:`, error);
            toast.error(`Lỗi đăng nhập với ${providerId}`, {
                description: 'Vui lòng thử lại sau',
            });

            if (onError) {
                onError(providerId, error);
            }
        } finally {
            setLoadingProvider(null);
        }
    };

    return (
        <div className="space-y-3">
            {socialProviders.map((provider) => (
                <Button
                    key={provider.id}
                    type="button"
                    variant="outline"
                    className={`w-full ${provider.bgColor} relative`}
                    onClick={() => handleSocialLogin(provider.id)}
                    disabled={loadingProvider !== null}
                >
                    {loadingProvider === provider.id ? (
                        <Loader2 className="mr-1 h-5 w-5 animate-spin" />
                    ) : (
                        <span className={`mr-1`}>{provider.icon}</span>
                    )}
                    {loadingProvider === provider.id
                        ? 'Đang kết nối...'
                        : `Tiếp tục với ${provider.name}`}
                </Button>
            ))}
        </div>
    );
}
