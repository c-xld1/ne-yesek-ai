-- Fix the trigger function to properly handle fullname from display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, fullname, avatar_url, user_group)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',     -- İlk olarak display_name'i kontrol et
            NEW.raw_user_meta_data->>'fullname',         -- Sonra fullname'i
            NEW.raw_user_meta_data->>'full_name'         -- Son olarak full_name'i
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        'Herkes'  -- Default user group
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
