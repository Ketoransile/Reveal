import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'This route is only available in development' }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Force upgrade
    const supabaseAdmin = createClient();
    // Wait, createClient from server uses cookie auth. For Admin update we need Service Role.

    // We can't easily import the admin client here unless we recreate it or use the one from webhook route logic.
    // Let's create a new ad-hoc admin client using env vars.

    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { error: updateError } = await adminClient
        .from('users')
        .update({
            subscription_plan: 'pro',
            credits: 9999
        })
        .eq('id', user.id);

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User upgraded to Pro (Dev Mode)' });
}
