import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
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

            // Ensure public profile exists
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Check if Secret Key is available
                const secretKey = process.env.SUPABASE_SECRET_KEY;
                if (!secretKey) {
                    console.error('[Auth Callback] CRITICAL: SUPABASE_SECRET_KEY is missing from environment variables!');
                } else {
                    console.log('[Auth Callback] Secret Key found, initializing Admin Client...');
                }

                // Use Secret Key to bypass RLS for profile creation
                // This allows us to heal the account even if RLS policies block user inserts
                const supabaseAdmin = createAdminClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SECRET_KEY!
                );

                const { data: existingProfile } = await supabaseAdmin
                    .from('users')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                if (!existingProfile) {
                    console.log('[Auth Callback] Creating missing profile for:', user.id);
                    // Ensure user_metadata is available
                    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';

                    const { error: insertError } = await supabaseAdmin.from('users').insert({
                        id: user.id,
                        email: user.email,
                        name: name,
                        credits: 3,
                        subscription_plan: 'free'
                    });

                    if (insertError) {
                        console.error('[Auth Callback] Error creating profile:', insertError);
                    } else {
                        console.log('[Auth Callback] Profile created successfully for:', user.id);
                    }
                } else {
                    console.log('[Auth Callback] Profile already exists for:', user.id);
                }
            }

            // Revalidate the landing page to refresh user state
            revalidatePath('/');
            revalidatePath('/dashboard');

            // Always redirect to dashboard after OAuth login
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('Auth callback error:', error);
            return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_code_missing`);
}
