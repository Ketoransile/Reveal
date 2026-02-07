-- Add subscription_period_end column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMP WITH TIME ZONE;
