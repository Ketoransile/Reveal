-- Migration: Add subscription plan to users table

-- Add subscription_plan column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'agency'));

-- Add comment for the new column
COMMENT ON COLUMN public.users.subscription_plan IS 'User subscription plan: free (3 analyses), pro ($29/mo unlimited), agency ($99/mo unlimited + features)';
