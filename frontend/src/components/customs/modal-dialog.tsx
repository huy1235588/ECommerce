import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    children?: React.ReactNode;
    footer?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
    className?: string;
}

const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colorMap = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
};

export const ModalDialog: React.FC<ModalDialogProps> = ({
    open,
    onOpenChange,
    title,
    description,
    type = 'info',
    children,
    footer,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isLoading = false,
    className,
}) => {
    const Icon = iconMap[type];

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('sm:max-w-[425px]', className)}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Icon className={cn('h-6 w-6', colorMap[type])} />
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {children && (
                    <div className="py-4">
                        {children}
                    </div>
                )}

                {footer || (onConfirm || onCancel) ? (
                    <DialogFooter>
                        {footer || (
                            <>
                                {onCancel && (
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                    >
                                        {cancelText}
                                    </Button>
                                )}
                                {onConfirm && (
                                    <Button
                                        onClick={handleConfirm}
                                        disabled={isLoading}
                                        className={cn(
                                            type === 'error' && 'bg-red-600 hover:bg-red-700',
                                            type === 'warning' && 'bg-yellow-600 hover:bg-yellow-700'
                                        )}
                                    >
                                        {isLoading ? 'Loading...' : confirmText}
                                    </Button>
                                )}
                            </>
                        )}
                    </DialogFooter>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};
