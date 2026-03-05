-- Drop the existing policy just in case it's misconfigured
DROP POLICY IF EXISTS "Cleaners can view their own data" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can update their own data" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can insert their own data" ON public.cleaners;

-- Ensure RLS is actually enabled to prevent data leaking
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- 1. Create a bulletproof SELECT policy for viewing data
CREATE POLICY "Cleaners can view their own data"
ON public.cleaners FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Ensure they can update it
CREATE POLICY "Cleaners can update their own data"
ON public.cleaners FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Ensure they can insert it
CREATE POLICY "Cleaners can insert their own data"
ON public.cleaners FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
