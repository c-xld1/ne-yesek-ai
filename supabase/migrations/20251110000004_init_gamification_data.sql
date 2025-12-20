-- Add sample competitions and initialize gamification data

-- Insert sample competition
INSERT INTO competitions (
    title, 
    description, 
    theme, 
    rules,
    prizes,
    start_date, 
    end_date, 
    status
) VALUES (
    'En Yaratici Kahvalti',
    'Sabah sofralarini renklendiren en yaratici kahvaltilik tarifi odullendiriyoruz!',
    'breakfast',
    '["Orijinal bir tarif olmali", "Gorsel sunum onemli", "Malzemeler kolayca bulunabilir olmali", "Hazirlanma suresi max 30 dakika"]'::jsonb,
    '["1. Odul: 3 Aylik Premium Uyelik + Anasayfada Ozel Vitrin", "2. Odul: Ozel Yarisma Kazanani Rozeti + 1000 Puan", "3. Odul: Topluluk Favorisi Rozeti + 500 Puan"]'::jsonb,
    NOW(),
    NOW() + INTERVAL '30 days',
    'active'
), (
    'Maksimum 3 Malzeme',
    'Sadece 3 malzemeyle harika tarifler yapabilir misiniz? Gosterin!',
    'quick_meal',
    '["En fazla 3 ana malzeme", "Tuz biber gibi temel baharatlar sayilmaz", "Video ile anlatim arti puan", "Lezzet ve yaraticilik kriterleri"]'::jsonb,
    '["1. Odul: Hizli Tarif Sampiyonu Rozeti + 1500 Puan", "2. Odul: 1 Aylik Premium + 750 Puan", "3. Odul: Ozel Rozet + 500 Puan"]'::jsonb,
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '37 days',
    'upcoming'
);

-- Initialize user points for existing profiles
INSERT INTO user_points (user_id, total_points, weekly_points, monthly_points, level)
SELECT 
    id,
    COALESCE((SELECT COUNT(*) * 50 FROM recipes WHERE author_id = profiles.id), 0) as total,
    COALESCE((SELECT COUNT(*) * 10 FROM recipes WHERE author_id = profiles.id), 0) as weekly,
    COALESCE((SELECT COUNT(*) * 25 FROM recipes WHERE author_id = profiles.id), 0) as monthly,
    1 + FLOOR(COALESCE((SELECT COUNT(*) * 50 FROM recipes WHERE author_id = profiles.id), 0) / 1000)
FROM profiles
ON CONFLICT (user_id) DO NOTHING;

-- Award points for existing recipes
INSERT INTO point_transactions (user_id, points, reason, reference_id, reference_type)
SELECT 
    author_id,
    50,
    'recipe_published',
    id,
    'recipe'
FROM recipes;

-- Update leaderboards
SELECT update_leaderboards();

-- Award first recipe badge to users with recipes
INSERT INTO user_badges (user_id, badge_key, display_order)
SELECT DISTINCT
    author_id,
    'dessert_master',
    1
FROM recipes r
JOIN categories c ON r.category_id = c.id
WHERE c.slug = 'tatlilar'
AND (SELECT COUNT(*) FROM recipes WHERE author_id = r.author_id AND category_id = c.id) >= 5
ON CONFLICT (user_id, badge_key) DO NOTHING;

-- Award video guru badge (placeholder - would need video_stories integration)
-- Award quick cook badge
INSERT INTO user_badges (user_id, badge_key, display_order)
SELECT DISTINCT
    author_id,
    'quick_cook',
    2
FROM recipes
WHERE cooking_time <= 30
GROUP BY author_id
HAVING COUNT(*) >= 10
ON CONFLICT (user_id, badge_key) DO NOTHING;
