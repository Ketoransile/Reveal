-- Migration: Add name field to users table

-- Add name column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add comment for the new column
COMMENT ON COLUMN public.users.name IS 'User display name';
