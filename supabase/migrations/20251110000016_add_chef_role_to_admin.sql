-- Add chef role to admin test user
INSERT INTO user_roles (user_id, role)
SELECT id, 'chef'
FROM auth.users
WHERE email = 'admin@test.com'
ON CONFLICT (user_id, role) DO NOTHING;

DO $$
DECLARE
  role_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO role_count
  FROM user_roles
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');
  
  RAISE NOTICE 'Admin user now has % roles', role_count;
END $$;
