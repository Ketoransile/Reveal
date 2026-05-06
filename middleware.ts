import { NextResponse, type NextRequest } from 'next/server'

/**
 * Lightweight middleware — NO network calls.
 *
 * Why: Vercel Edge middleware has a strict execution-time budget (often <5 s on
 * the Hobby plan).  Any HTTP round-trip to Supabase (getUser / getSession) can
 * easily exceed that, producing a 504 MIDDLEWARE_INVOCATION_TIMEOUT.
 *
 * Instead we only inspect the existing cookies:
 *   • Supabase stores an `sb-<ref>-auth-token` cookie when a user is logged in.
 *   • If the cookie is present we assume "authenticated" for routing purposes.
 *   • The *real* token validation happens later, inside Server Components or
 *     API Route Handlers, where the execution budget is much larger.
 */
export function middleware(request: NextRequest) {
    // Fast, zero-network auth check — just look at cookies
    const isAuthenticated = request.cookies.getAll().some(
        (cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth')
    )

    const { pathname } = request.nextUrl

    const isAuthPage =
        pathname.startsWith('/login') || pathname.startsWith('/signup')
    const isDashboardPage = pathname.startsWith('/dashboard')

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users to login from dashboard
    if (!isAuthenticated && isDashboardPage) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

