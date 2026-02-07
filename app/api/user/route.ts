import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user data
        let { data: userData, error: userError } = await supabase
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
                        email: user.email,
                        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                        credits: 3,
                        subscription_plan: 'free'
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('[API] Failed to recreate user profile:', createError);
                    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
                }

                userData = newUser;
            } else {
                console.error('[API] Error fetching user data:', userError);
                return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
            }
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

        // Auto-fail stuck analyses (older than 5 minutes)
        const now = new Date();
        const stuckAnalyses = analysesData?.filter(a =>
            a.status === 'processing' &&
            (now.getTime() - new Date(a.created_at).getTime()) > 5 * 60 * 1000
        ) || [];

        if (stuckAnalyses.length > 0) {
            console.log(`[API] Found ${stuckAnalyses.length} stuck analyses. Marking as failed.`);

            // Update in DB
            await Promise.all(stuckAnalyses.map(async (analysis) => {
                await supabase
                    .from('analyses')
                    .update({
                        status: 'failed',
                        error_message: 'Analysis timed out (system cleanup)'
                    })
                    .eq('id', analysis.id);

                // Update local object for response
                analysis.status = 'failed';
                analysis.error_message = 'Analysis timed out (system cleanup)';
            }));
        }

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
