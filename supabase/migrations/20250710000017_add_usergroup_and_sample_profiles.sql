-- Add userGroup column to existing profiles table if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_group TEXT DEFAULT 'Herkes' 
CHECK (user_group IN ('Herkes', 'Takipçiler', 'Premium'));

-- Note: Sample profiles will be created through the frontend authentication flow
-- This is safer than manually inserting into auth.users table
COMMENT ON COLUMN public.profiles.user_group IS 'User group for content access: Herkes, Takipçiler, Premium';
