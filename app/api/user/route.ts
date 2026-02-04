import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
            .select('*')
            .eq('id', user.id)
            .single();

        if (userError) {
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
