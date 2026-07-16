import { NextResponse } from 'next/server'

/**
 * Clears all Supabase auth cookies so the proxy stops treating a stale
 * PKCE code-verifier as an authenticated session, which would cause an
 * infinite redirect loop between /dashboard and /login.
 */
export async function POST() {
    const response = NextResponse.json({ cleared: true })

    // Clear any sb-* cookies the browser may have
    const cookieNames = [
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token-code-verifier`,
    ]

    for (const name of cookieNames) {
        response.cookies.set(name, '', {
            maxAge: 0,
            path: '/',
        })
    }

    return response
}
