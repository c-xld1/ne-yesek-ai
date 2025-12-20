-- Create chef profile for admin test user

INSERT INTO chef_profiles (
    id,
    is_verified,
    verification_status,
    specialty,
    bio,
    experience_years,
    business_name,
    business_hours,
    average_prep_time,
    minimum_order_amount,
    address,
    city,
    district,
    latitude,
    longitude,
    service_radius,
    is_active,
    is_accepting_orders,
    average_rating,
    total_reviews
)
SELECT 
    p.id,
    true,
    'approved',
    ARRAY['Türk Mutfağı', 'Ev Yemekleri', 'Tatlılar'],
    'Test şef hesabı - Admin kullanıcısı için oluşturuldu. Tüm özellikler test edilebilir.',
    10,
    'Admin Test Mutfağı',
    '{"monday": {"open": "09:00", "close": "20:00"}, "tuesday": {"open": "09:00", "close": "20:00"}, "wednesday": {"open": "09:00", "close": "20:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "10:00", "close": "18:00"}, "sunday": {"closed": true}}'::jsonb,
    45,
    50.00,
    'Test Mahallesi, Test Caddesi No:1',
    'İstanbul',
    'Kadıköy',
    41.0082,
    28.9784,
    10,
    true,
    true,
    4.8,
    0
FROM profiles p
INNER JOIN auth.users u ON u.id = p.id
WHERE u.email = 'admin@test.com'
ON CONFLICT (id) DO UPDATE SET
    is_verified = EXCLUDED.is_verified,
    verification_status = EXCLUDED.verification_status,
    specialty = EXCLUDED.specialty,
    bio = EXCLUDED.bio,
    experience_years = EXCLUDED.experience_years,
    business_name = EXCLUDED.business_name;

-- Log the result
DO $$
DECLARE
  chef_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO chef_count
  FROM chef_profiles
  WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@test.com');
  
  IF chef_count > 0 THEN
    RAISE NOTICE 'Chef profile created/updated for admin@test.com';
  ELSE
    RAISE NOTICE 'Admin user not found, chef profile not created';
  END IF;
END $$;
