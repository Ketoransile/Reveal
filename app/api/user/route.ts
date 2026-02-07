import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET() {
    console.log('[API] /api/user - Fetching user data');

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[API] Authentication error:', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user data
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*, subscription_plan, credits')
            .eq('id', user.id)
            .single();

        if (userError) {
            // Check if user is missing in public table (PGRST116 = Row not found)
            if (userError.code === 'PGRST116') {
                console.log('[API] User profile missing, recreating default profile for:', user.id);

                // Use Service Role Key to bypass RLS for profile creation
                const supabaseAdmin = createAdminClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SECRET_KEY!
                );

                // Recreate the user profile
                const { data: newUser, error: createError } = await supabaseAdmin
                    .from('users')
                    .insert({
                        id: user.id,
                        email: user.email, // Safe to use auth email here
                        name: user.user_metadata?.name || user.email?.split('@')[0],
                        credits: 3,
                        subscription_plan: 'free'
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('[API] Failed to recreate user profile:', createError);
                    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
                }

                // Use the newly created user
                // We need to re-assign or define userData here. 
                // Since userData is const above, we should modify the logic flow or use a let.
                // However, simpler is just to return the response here for this branch

                // Fetch user analyses (empty for new profile)
                return NextResponse.json({
                    user: newUser,
                    analyses: []
                }, { status: 200 });

            }

            console.error('[API] Error fetching user data:', userError);
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
        }

        // Fetch user analyses
        const { data: analysesData, error: analysesError } = await supabase
            .from('analyses')
            .select(`
                *,
                reports (*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (analysesError) {
            console.error('[API] Error fetching analyses:', analysesError);
        }

        console.log('[API] User data fetched - Credits:', userData.credits);
        console.log('[API] Analyses fetched:', analysesData?.length || 0);

        return NextResponse.json({
            user: userData,
            analyses: analysesData || []
        }, { status: 200 });

    } catch (error) {
        console.error('[API] Unexpected error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
