-- Temporarily disable the trigger to debug the issue
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- We'll handle profile creation manually in the application code
