import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
    number: number;
    title: string;
    description: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
    steps,
    currentStep,
    className,
}) => {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    {/* Step Circle */}
                    <div
                        className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                            currentStep > step.number
                                ? 'bg-primary text-primary-foreground border-primary'
                                : currentStep === step.number
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-muted-foreground border-muted'
                        )}
                    >
                        {currentStep > step.number ? (
                            <Check className="h-5 w-5" />
                        ) : (
                            <span className="text-sm font-medium">{step.number}</span>
                        )}
                    </div>

                    {/* Step Content */}
                    <div className="ml-3 hidden sm:block">
                        <p className={cn(
                            "text-sm font-medium transition-colors",
                            currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                        )}>
                            {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground max-w-32 lg:max-w-none">
                            {step.description}
                        </p>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                        <div className={cn(
                            "flex-1 h-0.5 mx-4 transition-all duration-200",
                            currentStep > step.number ? 'bg-primary' : 'bg-muted'
                        )} />
                    )}
                </div>
            ))}
        </div>
    );
};
