import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // If no token and trying to access dashboard, redirect to login
    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If there's a token and trying to access root or login, redirect to dashboard
    if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Basic root redirect
    if (!token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/'],
};
