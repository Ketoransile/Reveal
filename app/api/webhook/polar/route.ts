import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
// note: requires SUPABASE_SERVICE_ROLE_KEY in env for admin access
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || ''
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

        // Extract customer email
        // Note: Adjust property access based on exact SDK typing if needed
        // 'order' object typically has customer details
        const email = order.customer_email || order.customer?.email;

        if (email) {
            console.log(`Upgrading user ${email} to Pro`);

            // Update user to PRO plan
            // In a real app, check order.product_id to distinguish Pro vs Agency
            const { error } = await supabaseAdmin
                .from('users')
                .update({
                    subscription_plan: 'pro',
                    credits: 9999 // Give unlimited credits conceptually 
                })
                .eq('email', email);

            if (error) {
                console.error('Database update failed:', error);
            } else {
                console.log(`Success: User ${email} is now Pro`);
            }
        } else {
            console.log('No email found in order, skipping update.');
        }
    }
});
