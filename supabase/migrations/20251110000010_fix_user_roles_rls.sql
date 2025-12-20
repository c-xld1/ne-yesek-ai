-- Fix user_roles RLS policies to allow proper role creation

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON user_roles;
DROP POLICY IF EXISTS "Users can create their own user role" ON user_roles;

-- Allow anyone authenticated to read all roles
CREATE POLICY "Anyone can read all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own "user" role (for registration)
-- This solves the bootstrap problem for new users
CREATE POLICY "Users can create their own user role"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND role = 'user'
  );

-- Allow admins to insert any role
CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid())
  );

-- Allow admins to update any role
CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Allow admins to delete any role
CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create a function to auto-assign "user" role on new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Automatically insert a "user" role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Bootstrap first admin user (IMPORTANT: Replace with your actual user ID)
-- To get your user ID:
-- 1. Register/login to the app
-- 2. Run: SELECT id, email FROM auth.users;
-- 3. Update the UUID below with your user ID and uncomment:

-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('YOUR-USER-UUID-HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

COMMENT ON TABLE user_roles IS 'Stores user roles. New users automatically get "user" role. Admins can assign additional roles.';
