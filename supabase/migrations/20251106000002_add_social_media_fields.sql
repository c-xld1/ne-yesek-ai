-- Add social media and location fields to profiles table
-- These fields allow users to share their location and social media accounts

-- Add location field (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'location'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN location TEXT;
    END IF;
END $$;

-- Add website field (separate from website_url for clarity)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'website'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN website TEXT;
    END IF;
END $$;

-- Add individual social media fields for easier querying and validation
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'instagram'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN instagram TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'twitter'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN twitter TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'youtube'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN youtube TEXT;
    END IF;
END $$;

-- Add comment explaining the fields
COMMENT ON COLUMN public.profiles.location IS 'User''s location (city, country)';
COMMENT ON COLUMN public.profiles.website IS 'User''s personal website URL';
COMMENT ON COLUMN public.profiles.instagram IS 'Instagram username or profile URL';
COMMENT ON COLUMN public.profiles.twitter IS 'Twitter/X username or profile URL';
COMMENT ON COLUMN public.profiles.youtube IS 'YouTube channel name or URL';
