-- Add cover_image field to profiles table
-- This field stores the URL of the user's cover/banner image

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'cover_image'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN cover_image TEXT;
    END IF;
END $$;

-- Add comment explaining the field
COMMENT ON COLUMN public.profiles.cover_image IS 'User''s profile cover/banner image URL';
