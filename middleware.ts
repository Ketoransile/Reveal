import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Determine auth state resiliently:
    // 1. Try getUser() first — this makes a network call to verify the token
    //    and also refreshes the session cookie if needed.
    // 2. If the network call fails (e.g. offline), fall back to getSession()
    //    which reads from the cookie without requiring a network round-trip.
    //    This prevents wrongly redirecting the user to /login on temporary disconnects.
    let isAuthenticated = false

    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (user && !error) {
            isAuthenticated = true
        } else {
            // getUser returned no user (e.g. expired or invalid token)
            // Fall back to session check — the session cookie might still be valid
            const { data: { session } } = await supabase.auth.getSession()
            isAuthenticated = !!session
        }
    } catch {
        // Network error — can't reach Supabase.
        // Fall back to cookie-based session check (no network needed).
        try {
            const { data: { session } } = await supabase.auth.getSession()
            isAuthenticated = !!session
        } catch {
            // Even getSession failed — assume user is still authenticated
            // if we have any supabase auth cookies present.
            // This prevents kicking users out on brief connectivity issues.
            const hasAuthCookie = request.cookies.getAll().some(
                cookie => cookie.name.startsWith('sb-') && cookie.name.includes('auth')
            )
            isAuthenticated = hasAuthCookie
        }
    }

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup')
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users to login from dashboard
    if (!isAuthenticated && isDashboardPage) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         * - api routes (unless you want to protect them too)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
