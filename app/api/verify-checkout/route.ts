import { NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkout_id');

    if (!checkoutId) {
        return NextResponse.json({ error: 'Missing checkout_id' }, { status: 400 });
    }

    try {
        console.log('[Verify Checkout] Verifying checkout:', checkoutId);

        // 1. Identify the logged-in user
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 2. Fetch checkout from Polar
        const polar = new Polar({
            accessToken: process.env.POLAR_ACCESS_TOKEN!,
            server: 'sandbox', // Use sandbox for dev/testing. Ensure this matches checkout configuration.
        });

        const checkout = await polar.checkouts.get({
            id: checkoutId
        });

        console.log('[Verify Checkout] Polar Status:', checkout.status);

        // 3. Check if paid
        if (checkout.status === 'succeeded' || checkout.status === 'confirmed') {

            // 4. Determine which user to update
            let userIdToUpdate: string | undefined;
            let emailToUpdate: string | undefined;

            if (user) {
                console.log('[Verify Checkout] Authenticated User found:', user.id);
                userIdToUpdate = user.id;
            } else {
                console.log('[Verify Checkout] No authenticated user, falling back to checkout email');
                emailToUpdate = (checkout as any).customerEmail || (checkout as any).customer_email || (checkout as any).customer?.email;
            }

            if (!userIdToUpdate && !emailToUpdate) {
                return NextResponse.json({ error: 'Could not identify user to update' }, { status: 400 });
            }

            // 5. Update DB using Admin Client
            const supabaseAdmin = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            const now = new Date();
            const periodEnd = new Date(now);
            periodEnd.setMonth(periodEnd.getMonth() + 1); // 1 month from now

            let query = supabaseAdmin.from('users').update({
                subscription_plan: 'pro',
                credits: 1000000,
                subscription_period_end: periodEnd.toISOString()
            });

            if (userIdToUpdate) {
                query = query.eq('id', userIdToUpdate);
            } else if (emailToUpdate) {
                query = query.eq('email', emailToUpdate);
            }

            const { error } = await query;

            if (error) {
                console.error('[Verify Checkout] DB Update Failed:', error);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }

            console.log('[Verify Checkout] Successfully upgraded user');
            revalidatePath('/dashboard');
            return NextResponse.json({ success: true, plan: 'pro' });

        } else {
            console.log('[Verify Checkout] Checkout not succeeded yet');
            return NextResponse.json({ success: false, status: checkout.status });
        }

    } catch (error) {
        console.error('[Verify Checkout] Unexpected error:', error);
        return NextResponse.json({ error: 'Verification failed', details: error }, { status: 500 });
    }
}
