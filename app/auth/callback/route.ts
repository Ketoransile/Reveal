import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Revalidate the landing page to refresh user state
            revalidatePath('/');
            revalidatePath('/dashboard');

            // Always redirect to dashboard after OAuth login
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('Auth callback error:', error);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}
