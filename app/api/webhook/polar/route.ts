import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
// note: requires SUPABASE_SECRET_KEY (service role) in env for admin access
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onPayload: async (payload) => {
        // Log all events for debugging
        console.log('Polar Webhook Event:', payload.type, payload.data);
    },
    onOrderCreated: async (orderPayload) => {
        const order = orderPayload as any;
        console.log('Order created:', order.id);

        const email = order.customer_email || order.customer?.email;

        if (email) {
            console.log(`Processing Order for ${email}`);
            await updateUserSubscription(email, 'pro');
        }
    },
    onSubscriptionCreated: async (payload) => {
        const subscription = payload as any;
        console.log('Subscription created:', subscription.id);

        const email = subscription.customer?.email || subscription.email;
        if (email) {
            console.log(`Processing Subscription Creation for ${email}`);
            await updateUserSubscription(email, 'pro');
        }
    },
    onSubscriptionUpdated: async (payload) => {
        const subscription = payload as any;
        console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);

        const email = subscription.customer?.email || subscription.email;
        if (email) {
            // Only keep as pro if active or trialing
            const isActive = ['active', 'trialing'].includes(subscription.status);
            const plan = isActive ? 'pro' : 'free';

            console.log(`Updating Subscription for ${email} to ${plan} (Status: ${subscription.status})`);
            await updateUserSubscription(email, plan);
        }
    }
});

async function updateUserSubscription(email: string, plan: string) {
    const { error } = await supabaseAdmin
        .from('users')
        .update({
            subscription_plan: plan,
            // If pro, we conceptually give unlimited, but let's keep credits high just in case legacy logic checks it
            ...(plan === 'pro' || plan === 'agency' ? {
                credits: 1000000,
                subscription_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
            } : {})
        })
        .eq('email', email);

    if (error) {
        console.error(`Database update failed for ${email}:`, error);
    } else {
        console.log(`Success: User ${email} updated to ${plan}`);
    }
}

