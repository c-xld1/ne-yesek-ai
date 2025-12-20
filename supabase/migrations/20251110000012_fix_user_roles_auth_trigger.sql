-- Fix user_roles and auth trigger integration
-- This combines profile creation and role assignment into a single trigger

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create unified function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, fullname)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Assign default "user" role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Create unified trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for user_roles to allow service role to insert
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

-- Allow service role to insert (for trigger)
CREATE POLICY "Service role can insert roles"
  ON user_roles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow users to view their own roles
CREATE POLICY "Users can read own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow admins to insert any role (using has_role function to avoid recursive lookup)
CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin')
  );

-- Allow admins to update any role
CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin')
  );

-- Allow admins to delete any role
CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin')
  );
