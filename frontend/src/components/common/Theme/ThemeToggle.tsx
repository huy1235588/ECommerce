"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        {
            mode: "light" as const,
            label: "Light",
            icon: Sun,
            description: "Light theme",
        },
        {
            mode: "dark" as const,
            label: "Dark",
            icon: Moon,
            description: "Dark theme",
        },
        {
            mode: "system" as const,
            label: "System",
            icon: Monitor,
            description: "System preference",
        },
    ];

    const currentTheme = themes.find(t => t.mode === theme) || themes[0]; // Fallback to first theme if not found
    const CurrentIcon = currentTheme.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "relative h-9 w-9 transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
                    )}
                    aria-label={`Current theme: ${currentTheme.label}. Click to change theme.`}
                >
                    <CurrentIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
                {themes.map(t => {
                    const Icon = t.icon;
                    const isActive = theme === t.mode;

                    return (
                        <DropdownMenuItem
                            key={t.mode}
                            onClick={() => setTheme(t.mode)}
                            className={cn(
                                "flex cursor-pointer items-center gap-2",
                                isActive && "bg-accent text-accent-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {t.label}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {t.description}
                                </span>
                            </div>
                            {isActive && (
                                <div className="bg-primary ml-auto h-1.5 w-1.5 rounded-full" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Simple toggle button (cycles through themes)
export function SimpleThemeToggle() {
    const { theme, themes, setTheme } = useTheme();

    const handleToggle = () => {
        const currentIndex = themes.indexOf(theme || "system"); // Fallback to "system" if theme is undefined
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const getIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="h-4 w-4" />;
            case "dark":
                return <Moon className="h-4 w-4" />;
            case "system":
                return <Monitor className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />; // Fallback icon
        }
    };

    const getLabel = () => {
        switch (theme) {
            case "light":
                return "Light theme";
            case "dark":
                return "Dark theme";
            case "system":
                return "System theme";
            default:
                return "System theme"; // Fallback label
        }
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className="h-9 w-9"
            aria-label={`Current: ${getLabel()}. Click to cycle themes.`}
        >
            {getIcon()}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
