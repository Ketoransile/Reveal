# Subscription Plan Implementation Guide

## Database Schema Update

### New Field: `subscription_plan`

A new column has been added to the `users` table to track subscription tiers:

**Column:** `subscription_plan`  
**Type:** TEXT  
**Default:** 'free'  
**Allowed Values:** 'free', 'pro', 'agency'

### Migration Required

To add this field to your existing Supabase database, run the following SQL migration:

```sql
-- Add subscription_plan column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free' 
CHECK (subscription_plan IN ('free', 'pro', 'agency'));
```

**Migration file location:** `supabase-add-subscription-plan.sql`

## Subscription Tiers

### 1. Free Plan (`subscription_plan = 'free'`)
- **Cost:** $0/month
- **Credits:** 3 analyses per month
- **Features:** Basic conversion scores

### 2. Pro Plan (`subscription_plan = 'pro'`)
- **Cost:** $29/month
- **Credits:** Unlimited analyses
- **Features:** Deep dive AI, Export to PDF, Priority support

### 3. Agency Plan (`subscription_plan = 'agency'`)
- **Cost:** $99/month
- **Credits:** Unlimited analyses
- **Features:** Everything in Pro + White-label reports, API access, Dedicated account manager

## Settings Page - Billing Tab Features

The billing section now displays:

### For Free Plan Users:
1. **Credits Remaining:** Visual progress bar showing X / 3 credits
2. **Monthly Usage:** Shows analyses used this month vs limit (e.g., 2 / 3)
3. **All-time Stats:**
   - Total analyses created
   - Total completed analyses
4. **Upgrade Button:** Links to `/pricing` page

### For Pro/Agency Users:
1. **Current Plan Display:** Shows active subscription
2. **Monthly Usage:** Shows analyses this month (no limit)
3. **All-time Stats:**
   - Total analyses created
   - Total completed analyses
4. **Manage Billing Button:** (Currently disabled, ready for Stripe integration)

## Usage Tracking

The system automatically calculates:

- **Total Analyses:** Total number of analyses ever created
- **Completed Analyses:** Number of successfully completed analyses
- **Monthly Analyses:** Analyses created in the current calendar month

These metrics are computed from the `analyses` table in real-time when the settings page loads.

## User Properties Available

When fetching user data via `/api/user`, the following properties are now available:

```typescript
{
  user: {
    id: string;
    email: string;
    credits: number;                    // Remaining credits
    subscription_plan: 'free' | 'pro' | 'agency';
    created_at: timestamp;
    updated_at: timestamp;
  },
  analyses: Array<{
    id: string;
    user_id: string;
    your_url: string;
    competitor_url: string;
    status: 'processing' | 'completed' | 'failed';
    created_at: timestamp;
    // ... other fields
  }>
}
```

## Next Steps for Full Implementation

1. **Run the migration** in your Supabase dashboard
2. **Implement Stripe integration** for actual payment processing
3. **Update credit deduction logic** in `/app/api/analyze/route.ts` to check subscription_plan
4. **Add webhook handlers** to update subscription_plan when payments succeed
5. **Implement monthly credit reset** (for free users) via cron job or Supabase function

## Files Modified

1. `supabase-schema.sql` - Updated schema definition
2. `supabase-add-subscription-plan.sql` - New migration file
3. `app/dashboard/settings/page.tsx` - Enhanced billing tab with real usage data
4. Schema now supports subscription tracking

---

**Note:** The subscription_plan field defaults to 'free' for all existing and new users. You'll need to update this field via Stripe webhooks when users upgrade.
