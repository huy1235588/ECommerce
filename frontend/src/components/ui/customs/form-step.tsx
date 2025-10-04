import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/customs/loading-spinner';

interface FormStepProps {
    title: string;
    description: string;
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
    onNext?: () => void;
    onPrevious?: () => void;
    onSubmit?: () => void;
    isNextDisabled?: boolean;
    isPreviousDisabled?: boolean;
    isSubmitting?: boolean;
    showNavigation?: boolean;
    className?: string;
}

export const FormStep: React.FC<FormStepProps> = ({
    title,
    description,
    children,
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    onSubmit,
    isNextDisabled = false,
    isPreviousDisabled = false,
    isSubmitting = false,
    showNavigation = true,
    className,
}) => {
    const isLastStep = currentStep === totalSteps;
    const isFirstStep = currentStep === 1;

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>
                            Step {currentStep}: {title}
                        </CardTitle>
                        <CardDescription>
                            {description}
                        </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {currentStep} of {totalSteps}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Step Content */}
                <div>
                    {children}
                </div>

                {/* Navigation */}
                {showNavigation && (
                    <div className="flex items-center justify-between pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={onPrevious}
                            disabled={isPreviousDisabled || isFirstStep}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-2">
                            {isLastStep ? (
                                <Button
                                    onClick={onSubmit}
                                    disabled={isSubmitting || isNextDisabled}
                                    className="flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {isSubmitting ? 'Creating...' : 'Create Collection'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={onNext}
                                    disabled={isNextDisabled}
                                    className="flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
