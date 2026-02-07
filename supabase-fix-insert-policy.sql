-- Add policy specifically for inserting own profile (needed for auto-healing)
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
