-- Create test admin user for development
-- This script creates a test user and assigns admin role

-- First, check if test user exists and get their ID
DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT := 'admin@test.com';
BEGIN
  -- Try to find existing user
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = test_email;

  -- If user doesn't exist, create one
  IF test_user_id IS NULL THEN
    -- Insert into auth.users (this will trigger profile and role creation)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      test_email,
      crypt('admin123', gen_salt('bf')), -- Password: admin123
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"username": "admin", "full_name": "Admin User"}',
      FALSE,
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO test_user_id;

    RAISE NOTICE 'Created test user with ID: %', test_user_id;
  ELSE
    RAISE NOTICE 'Test user already exists with ID: %', test_user_id;
  END IF;

  -- Ensure admin role is assigned
  INSERT INTO public.user_roles (user_id, role)
  VALUES (test_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Admin role assigned to user: %', test_user_id;
  RAISE NOTICE 'Login credentials: %', test_email;
  RAISE NOTICE 'Password: admin123';
END $$;
