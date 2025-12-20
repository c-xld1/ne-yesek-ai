-- Add is_banned and ban_reason fields to profiles table

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ban_reason TEXT;

-- Add index for banned users
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned) WHERE is_banned = true;

COMMENT ON COLUMN public.profiles.is_banned IS 'Whether the user account is banned';
COMMENT ON COLUMN public.profiles.ban_reason IS 'Reason for banning the user';
