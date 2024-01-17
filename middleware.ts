import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    const isProtectedRoute = (path: string) => {
        const protectedRoutes = ['/dashboard', '/task-tracker', '/request-leave', '/my-account', '/complete-profile', '/'];
        return protectedRoutes.includes(path);
    }
    const data = await getToken({ req });
    const token = data?.token
    const isAuthenticated = !!token;
    const disallowedAuthenticatedPaths = ['/login', '/register', '/verify'];
    const disallowedAuthenticatedPathsWithCompleteRegister = ['/login', '/register', '/verify', '/complete-profile'];
    const isCompleteProfile = data?.user.isCompleted
    if (isAuthenticated && disallowedAuthenticatedPathsWithCompleteRegister.some(path => req.nextUrl.pathname.startsWith(path)) && isCompleteProfile) {
        return NextResponse.redirect(new URL('/dashboard', req.url)); // to be changed
    }


    if (!isAuthenticated && isProtectedRoute(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isAuthenticated && disallowedAuthenticatedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/complete-profile', req.url)); // to be changed
    }

    const authMiddleware = await withAuth({
        callbacks: {
            authorized: async ({ req }) => {
                const pathname = req.nextUrl.pathname;
                if (token) {
                    return true
                }

                if (pathname.startsWith("/_next") || pathname === "/favicon.ico" || pathname.startsWith('/register') || pathname.startsWith('/verify')) {
                    return true;
                }

                return false;
            },
        },
        pages: {
            signIn: '/login',
            newUser: '/register'
        },
    });

    // @ts-expect-error
    return authMiddleware(req, event);
}
