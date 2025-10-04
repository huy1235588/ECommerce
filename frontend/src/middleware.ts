import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('refreshToken')?.value;

    // Define authentication pages
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isAuthPage = authPages.includes(pathname);

    // Define protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && isAuthPage) {
        const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!token && isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, icons, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
