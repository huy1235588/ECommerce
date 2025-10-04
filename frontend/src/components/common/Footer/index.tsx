'use client';

interface FooterProps {
    className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
    return (
        <footer className={`border-t bg-background ${className}`}>
            footer
        </footer>
    );
}
