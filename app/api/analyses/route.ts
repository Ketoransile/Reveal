import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    console.log('[API] /api/analyses - Fetching all analyses');

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[API] Authentication error:', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all analyses for the user
        const { data: analyses, error: analysesError } = await supabase
            .from('analyses')
            .select(`
        *,
        reports (
          id,
          conversion_score,
          winner
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (analysesError) {
            console.error('[API] Error fetching analyses:', analysesError);
            return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 });
        }

        console.log('[API] Fetched', analyses?.length || 0, 'analyses');

        return NextResponse.json(analyses || [], { status: 200 });

    } catch (error) {
        console.error('[API] Unexpected error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
