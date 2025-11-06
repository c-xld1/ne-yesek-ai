-- Başarılar (Achievements) sistemi için tablolar

-- Başarı tanımları tablosu
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL, -- Unique identifier for the achievement
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL, -- Emoji veya icon identifier
    color TEXT NOT NULL, -- bg-blue-500, bg-yellow-500, etc.
    requirement_type TEXT NOT NULL, -- 'recipe_count', 'follower_count', 'like_count', 'view_count', etc.
    requirement_value INTEGER NOT NULL, -- Gerekli değer
    points INTEGER DEFAULT 10, -- Başarı puanı
    order_index INTEGER DEFAULT 0, -- Sıralama için
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı başarıları tablosu
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_key TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_key)
);

-- RLS politikaları
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Başarı tanımları herkes görebilir
CREATE POLICY "Achievement definitions are viewable by everyone"
    ON public.achievement_definitions FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Kullanıcı başarıları herkes görebilir
CREATE POLICY "User achievements are viewable by everyone"
    ON public.user_achievements FOR SELECT
    TO anon, authenticated
    USING (true);

-- Kullanıcılar kendi başarılarını ekleyebilir (sistem tarafından)
CREATE POLICY "Users can insert their own achievements"
    ON public.user_achievements FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_key ON public.user_achievements(achievement_key);
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_key ON public.achievement_definitions(key);
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_order ON public.achievement_definitions(order_index);

-- Başarı tanımlarını ekle
INSERT INTO public.achievement_definitions (key, title, description, icon, color, requirement_type, requirement_value, points, order_index) VALUES
    ('first_recipe', 'İlk Tarif', 'İlk tarifini paylaştı', '👨‍🍳', 'bg-blue-500', 'recipe_count', 1, 10, 1),
    ('recipe_master_10', 'Tarif Meraklısı', '10 tarif paylaştı', '📝', 'bg-green-500', 'recipe_count', 10, 25, 2),
    ('recipe_master_50', 'Tarif Ustası', '50 tarif paylaştı', '📚', 'bg-purple-500', 'recipe_count', 50, 50, 3),
    ('recipe_master_100', 'Tarif Efsanesi', '100+ tarif paylaştı', '🏆', 'bg-orange-500', 'recipe_count', 100, 100, 4),
    
    ('popular_chef_100', 'Yükselen Yıldız', '100+ takipçiye ulaştı', '⭐', 'bg-yellow-500', 'follower_count', 100, 20, 5),
    ('popular_chef_1000', 'Popüler Chef', '1000+ takipçiye ulaştı', '🌟', 'bg-yellow-500', 'follower_count', 1000, 50, 6),
    ('popular_chef_10000', 'Süper Chef', '10K+ takipçiye ulaştı', '💫', 'bg-purple-500', 'follower_count', 10000, 100, 7),
    
    ('liked_100', 'Beğenilen Chef', 'Tarifleri 100+ beğeni aldı', '❤️', 'bg-red-500', 'total_likes', 100, 20, 8),
    ('liked_1000', 'Çok Beğenilen', 'Tarifleri 1000+ beğeni aldı', '💖', 'bg-red-500', 'total_likes', 1000, 50, 9),
    
    ('viewed_1000', 'İzlenen Chef', 'Tarifleri 1K+ görüntüleme aldı', '👁️', 'bg-blue-500', 'total_views', 1000, 25, 10),
    ('viewed_10000', 'Çok İzlenen', 'Tarifleri 10K+ görüntüleme aldı', '👀', 'bg-blue-500', 'total_views', 10000, 75, 11),
    
    ('early_adopter', 'İlk Kullanıcılar', 'Platformun ilk kullanıcılarından', '🎯', 'bg-indigo-500', 'special', 1, 50, 12),
    ('verified_chef', 'Onaylı Chef', 'Hesabı doğrulandı', '✅', 'bg-green-500', 'special', 1, 30, 13)
ON CONFLICT (key) DO NOTHING;

-- Başarı kontrolü için fonksiyon
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_recipe_count INTEGER;
    v_follower_count INTEGER;
    v_total_likes INTEGER;
    v_total_views INTEGER;
    v_achievement RECORD;
BEGIN
    -- Kullanıcı istatistiklerini al
    SELECT COUNT(*) INTO v_recipe_count
    FROM recipes WHERE user_id = p_user_id AND is_draft = false;
    
    SELECT COUNT(*) INTO v_follower_count
    FROM user_follows WHERE followed_id = p_user_id;
    
    SELECT COALESCE(SUM(likes_count), 0) INTO v_total_likes
    FROM recipes WHERE user_id = p_user_id;
    
    SELECT COALESCE(SUM(views), 0) INTO v_total_views
    FROM recipes WHERE user_id = p_user_id;
    
    -- Her başarı tanımını kontrol et
    FOR v_achievement IN 
        SELECT * FROM achievement_definitions WHERE is_active = true
    LOOP
        -- Eğer başarı zaten kazanılmamışsa
        IF NOT EXISTS (
            SELECT 1 FROM user_achievements 
            WHERE user_id = p_user_id AND achievement_key = v_achievement.key
        ) THEN
            -- Başarı koşullarını kontrol et
            IF (v_achievement.requirement_type = 'recipe_count' AND v_recipe_count >= v_achievement.requirement_value)
            OR (v_achievement.requirement_type = 'follower_count' AND v_follower_count >= v_achievement.requirement_value)
            OR (v_achievement.requirement_type = 'total_likes' AND v_total_likes >= v_achievement.requirement_value)
            OR (v_achievement.requirement_type = 'total_views' AND v_total_views >= v_achievement.requirement_value)
            THEN
                -- Başarıyı ver
                INSERT INTO user_achievements (user_id, achievement_key)
                VALUES (p_user_id, v_achievement.key);
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tarif eklendiğinde başarı kontrolü yap
CREATE OR REPLACE FUNCTION check_achievements_on_recipe_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Sadece draft olmayan tarifler için
    IF NEW.is_draft = false THEN
        PERFORM check_and_award_achievements(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
DROP TRIGGER IF EXISTS trigger_check_achievements_on_recipe ON recipes;
CREATE TRIGGER trigger_check_achievements_on_recipe
    AFTER INSERT OR UPDATE OF is_draft ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION check_achievements_on_recipe_insert();

-- Like eklendiğinde başarı kontrolü
CREATE OR REPLACE FUNCTION check_achievements_on_like()
RETURNS TRIGGER AS $$
DECLARE
    v_recipe_owner_id UUID;
BEGIN
    -- Tarif sahibini bul
    SELECT user_id INTO v_recipe_owner_id
    FROM recipes WHERE id = NEW.recipe_id;
    
    -- Başarı kontrolü yap
    IF v_recipe_owner_id IS NOT NULL THEN
        PERFORM check_and_award_achievements(v_recipe_owner_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_achievements_on_like ON recipe_favorites;
CREATE TRIGGER trigger_check_achievements_on_like
    AFTER INSERT ON recipe_favorites
    FOR EACH ROW
    EXECUTE FUNCTION check_achievements_on_like();

-- View güncellendiğinde başarı kontrolü
CREATE OR REPLACE FUNCTION check_achievements_on_view_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.views != OLD.views THEN
        PERFORM check_and_award_achievements(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_achievements_on_view ON recipes;
CREATE TRIGGER trigger_check_achievements_on_view
    AFTER UPDATE OF views ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION check_achievements_on_view_update();
