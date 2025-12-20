-- Sample data for Chef & Marketplace system

-- Insert sample chef badges
INSERT INTO chef_badges (name, description, icon, color, requirement_type, requirement_value) VALUES
('Yeni Yıldız', 'İlk 10 siparişi başarıyla tamamladı', '⭐', '#10B981', 'orders_completed', '{"min": 10}'),
('Hızlı Teslimat', 'Ortalama hazırlık süresi 30 dakikanın altında', '⚡', '#F59E0B', 'response_time', '{"max": 30}'),
('5 Yıldızlı Şef', '4.8+ ortalama puana sahip', '🏆', '#EF4444', 'rating_average', '{"min": 4.8}'),
('Tatlı Ustası', 'Tatlı kategorisinde 50+ sipariş', '🍰', '#EC4899', 'specialty', '{"category": "Tatlı", "min": 50}'),
('Ana Yemek Gurusu', 'Ana yemek kategorisinde 100+ sipariş', '🍽️', '#8B5CF6', 'specialty', '{"category": "Ana Yemek", "min": 100}'),
('Hamur İşi Uzmanı', 'Hamur işleri kategorisinde 75+ sipariş', '🥟', '#3B82F6', 'specialty', '{"category": "Hamur İşi", "min": 75}'),
('Premium Şef', 'Premium üyeliğe sahip', '💎', '#6366F1', 'premium', '{"premium": true}'),
('Süper Satıcı', '500+ sipariş tamamladı', '🎖️', '#14B8A6', 'orders_completed', '{"min": 500}')
ON CONFLICT (name) DO NOTHING;

-- Create sample chef profile (using existing admin user)
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
    latitude,
    longitude,
    service_radius,
    is_active,
    is_accepting_orders,
    badges
)
SELECT 
    id,
    true,
    'approved',
    ARRAY['Türk Mutfağı', 'Ev Yemekleri', 'Tatlılar'],
    'Ev yapımı lezzetler, anneanneden öğrendiğim tariflerle hazırlıyorum. 15 yıllık deneyimim var.',
    15,
    'Ayşe''nin Mutfağı',
    '{"monday": {"open": "09:00", "close": "20:00"}, "tuesday": {"open": "09:00", "close": "20:00"}, "wednesday": {"open": "09:00", "close": "20:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "10:00", "close": "18:00"}, "sunday": {"closed": true}}'::jsonb,
    45,
    50.00,
    'Cumhuriyet Mahallesi, Atatürk Caddesi No:123',
    'İstanbul',
    41.0082,
    28.9784,
    10,
    true,
    true,
    ARRAY['Yeni Yıldız', '5 Yıldızlı Şef']
FROM profiles
WHERE username = 'admin'
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (
    chef_id,
    name,
    description,
    category,
    price,
    image_url,
    portion_size,
    ingredients,
    allergens,
    tags,
    prep_time,
    delivery_type,
    instant_delivery_available,
    scheduled_delivery_available,
    min_notice_hours,
    is_available,
    daily_stock,
    current_stock
)
SELECT 
    cp.id,
    'Ev Yapımı Mantı',
    'El açması hamur ile hazırlanan geleneksel Türk mantısı. Yoğurt, tereyağı ve acı sos eşliğinde.',
    'Ana Yemek',
    120.00,
    'https://images.unsplash.com/photo-1626189296278-8a8e6c0a6c7e',
    '2 kişilik',
    ARRAY['Un', 'Yumurta', 'Kıyma', 'Soğan', 'Yoğurt', 'Tereyağı'],
    ARRAY['Gluten', 'Süt'],
    ARRAY['ev yapımı', 'geleneksel', 'özel tarif'],
    90,
    'both',
    true,
    true,
    4,
    true,
    10,
    10
FROM chef_profiles cp
WHERE cp.id = (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1)
UNION ALL
SELECT 
    cp.id,
    'Künefe (1 Porsiyon)',
    'Antep fıstığı ve kaymak ile servis edilen taze künefe. Sipariş anında hazırlanır.',
    'Tatlı',
    85.00,
    'https://images.unsplash.com/photo-1571167534571-919e8ded1eb1',
    '1 kişilik',
    ARRAY['Tel kadayıf', 'Kaymak', 'Antep fıstığı', 'Şerbet'],
    ARRAY['Gluten', 'Süt'],
    ARRAY['taze', 'sıcak', 'geleneksel'],
    20,
    'instant',
    true,
    false,
    0,
    true,
    20,
    20
FROM chef_profiles cp
WHERE cp.id = (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1)
UNION ALL
SELECT 
    cp.id,
    'Özel Yaş Pasta',
    'İsteğe göre özel tasarım doğum günü pastası. Çikolata veya meyveli seçenekler mevcut.',
    'Tatlı',
    350.00,
    'https://images.unsplash.com/photo-1558636508-e0db3814bd1d',
    '8-10 kişilik',
    ARRAY['Un', 'Yumurta', 'Şeker', 'Krema', 'Çikolata/Meyve'],
    ARRAY['Gluten', 'Yumurta', 'Süt'],
    ARRAY['özel yapım', 'doğum günü', 'randevulu'],
    180,
    'scheduled',
    false,
    true,
    48,
    true,
    2,
    2
FROM chef_profiles cp
WHERE cp.id = (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1)
UNION ALL
SELECT 
    cp.id,
    'Mercimek Çorbası',
    'Geleneksel kırmızı mercimek çorbası. Limon ve baharatlarla servis edilir.',
    'Çorba',
    35.00,
    'https://images.unsplash.com/photo-1547592166-23ac45744acd',
    '2 kişilik',
    ARRAY['Kırmızı mercimek', 'Soğan', 'Un', 'Baharatlar'],
    ARRAY['Gluten'],
    ARRAY['sağlıklı', 'hafif', 'vegan'],
    25,
    'instant',
    true,
    false,
    0,
    true,
    15,
    15
FROM chef_profiles cp
WHERE cp.id = (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1)
UNION ALL
SELECT 
    cp.id,
    'Kıymalı Börek (Tepsi)',
    'El açması yufka ile hazırlanan kıymalı tepsi börek. Sıcak servis edilir.',
    'Hamur İşi',
    180.00,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    '6-8 kişilik',
    ARRAY['Yufka', 'Kıyma', 'Soğan', 'Maydanoz', 'Yumurta'],
    ARRAY['Gluten', 'Yumurta'],
    ARRAY['ev yapımı', 'taze', 'doyurucu'],
    60,
    'both',
    true,
    true,
    2,
    true,
    5,
    5
FROM chef_profiles cp
WHERE cp.id = (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1);

-- Update chef profile stats
UPDATE chef_profiles
SET total_orders = 127,
    completed_orders = 120,
    cancelled_orders = 7,
    average_rating = 4.85,
    total_reviews = 89,
    response_rate = 98.5,
    average_response_time = 15
WHERE id = (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1);

-- Award badges to chef (only if admin user exists)
INSERT INTO chef_badge_awards (chef_id, badge_id)
SELECT 
    p.id,
    cb.id
FROM profiles p
CROSS JOIN chef_badges cb
WHERE p.username = 'admin'
AND cb.name IN ('Yeni Yıldız', '5 Yıldızlı Şef', 'Hızlı Teslimat')
ON CONFLICT DO NOTHING;

COMMIT;
