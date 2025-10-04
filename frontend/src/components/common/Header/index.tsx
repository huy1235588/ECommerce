'use client';

import {
    Search,
    Settings,
    User as UserIcon,
    LogOut,
    Moon,
    Sun, HelpCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User } from '@/types/api';
import { useAuth } from '@/hooks/api';
import NotificationDropdown from './NotificationDropdown';
import { useTheme } from 'next-themes';
interface HeaderProps {
    showMobileMenu?: boolean;
    user?: User | null;
    setOpenSidebar?: (open: boolean) => void;
}

export default function Header({
    showMobileMenu = true,
    user,
    setOpenSidebar
}: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const {
        logout,
    } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search page with query
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };


    const renderUserMenu = () => {
        if (!user) {
            return (
                <Link href="/login">
                    <Button variant="outline" size="sm">
                        Login
                    </Button>
                </Link>
            );
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.avatarUrl} alt={user?.username || 'User'} />
                            <AvatarFallback>
                                {user?.firstName?.[0]?.toUpperCase() ||
                                    user?.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user?.username || 'User'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email || ''}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <UserIcon className="mr-2 h-4 w-4" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/help">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Help & Support
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }


    return (
        <header className="sticky top-0 z-50 w-full px-6 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full flex h-16 items-center">
                {/* Mobile Menu Button */}
                {showMobileMenu && (
                    <div className="flex lg:hidden">
                        <SidebarTrigger />
                    </div>
                )}

                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logos/logo.png"
                            alt="Logo"
                            width={100}
                            height={32}
                        />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex flex-1 items-center px-6">
                    <form onSubmit={handleSearch} className="w-full max-w-sm">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search collections, items..."
                                className="pl-8 pr-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setTheme(theme === 'light' ? 'dark' : 'light'); }}
                        className="h-9 w-9 px-0"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* User Menu */}
                    {renderUserMenu()}
                </div>
            </div>
        </header>
    );
}
