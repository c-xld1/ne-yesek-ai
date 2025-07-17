-- Insert sample data for development and testing

-- Insert some sample users (these will be created when users register)
-- Note: Actual user profiles will be created via the auth trigger

-- Insert sample categories (some are already inserted in the categories migration)
INSERT INTO public.categories (name, slug, description, sort_order, color) VALUES
('Pizza', 'pizza', 'İtalyan pizza tarifleri', 11, '#FF6B6B'),
('Burger', 'burger', 'Ev yapımı burger tarifleri', 12, '#4ECDC4'),
('Smoothie', 'smoothie', 'Sağlıklı smoothie tarifleri', 13, '#45B7D1'),
('Pasta', 'pasta', 'İtalyan makarna tarifleri', 14, '#96CEB4'),
('Sushi', 'sushi', 'Japon sushi tarifleri', 15, '#FFEAA7')
ON CONFLICT (slug) DO NOTHING;

-- Insert more QnA categories  
INSERT INTO public.qna_categories (name, slug, description, sort_order, color, icon) VALUES
('Başlangıç', 'baslangic', 'Yeni başlayanlar için sorular', 9, '#FF6B6B', '🔰'),
('Profesyonel İpuçları', 'profesyonel-ipuclari', 'Profesyonel şeflerden ipuçları', 10, '#4ECDC4', '👨‍🍳'),
('Özel Günler', 'ozel-gunler', 'Özel günler için tarifler', 11, '#45B7D1', '🎉'),
('Çocuk Dostu', 'cocuk-dostu', 'Çocukların seveceği tarifler', 12, '#96CEB4', '👶'),
('Hızlı Tarifler', 'hizli-tarifler', '30 dakikada hazır tarifler', 13, '#FFEAA7', '⚡')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample affiliate links
INSERT INTO public.affiliate_links (name, description, url, affiliate_url, category, commission_rate, image_url) VALUES
('KitchenAid Mikser', 'Profesyonel mutfak mikseri', 'https://example.com/kitchenaid', 'https://affiliate.example.com/kitchenaid', 'Mutfak Aletleri', 5.00, 'https://example.com/images/kitchenaid.jpg'),
('Tefal Tava Seti', 'Yapışmaz yüzey tava seti', 'https://example.com/tefal', 'https://affiliate.example.com/tefal', 'Mutfak Aletleri', 8.50, 'https://example.com/images/tefal.jpg'),
('Organik Zeytinyağı', 'Soğuk sıkım organik zeytinyağı', 'https://example.com/zeytinyagi', 'https://affiliate.example.com/zeytinyagi', 'Malzemeler', 12.00, 'https://example.com/images/zeytinyagi.jpg'),
('Baharatlık Seti', 'Çeşitli baharat ve otlar', 'https://example.com/baharat', 'https://affiliate.example.com/baharat', 'Malzemeler', 7.25, 'https://example.com/images/baharat.jpg'),
('Silikon Kalıp Seti', 'Fırın için silikon kalıplar', 'https://example.com/kalip', 'https://affiliate.example.com/kalip', 'Fırın Gereçleri', 6.75, 'https://example.com/images/kalip.jpg');

-- Note: Sample recipes, comments, and other user-generated content will be created
-- when actual users register and use the application. The database structure is
-- now ready to support all the application features.

-- Create some utility functions for development

-- Function to generate sample data (for development only)
CREATE OR REPLACE FUNCTION public.generate_sample_data()
RETURNS VOID AS $$
BEGIN
    -- This function can be used to generate sample data for development
    -- It should only be used in development environment
    RAISE NOTICE 'Sample data generation function is ready. Call this function manually if needed for development.';
END;
$$ LANGUAGE plpgsql;

-- Function to reset all data (for development only)
CREATE OR REPLACE FUNCTION public.reset_all_data()
RETURNS VOID AS $$
BEGIN
    -- WARNING: This will delete all data
    -- Should only be used in development environment
    TRUNCATE TABLE public.notifications RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.shopping_list_items RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.shopping_lists RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.answers RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.questions RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.video_stories RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.blog_posts RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.ratings RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.likes RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.favorites RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.follows RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.comments RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.recipes RESTART IDENTITY CASCADE;
    TRUNCATE TABLE public.profiles RESTART IDENTITY CASCADE;
    
    RAISE NOTICE 'All data has been reset. Categories and affiliate links are preserved.';
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_full_text_search ON public.recipes 
USING GIN(public.immutable_tsvector(title, description, tags));

CREATE INDEX IF NOT EXISTS idx_recipes_published_recent ON public.recipes(published_at DESC) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_recipes_popular ON public.recipes(views DESC, likes_count DESC) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, created_at DESC) 
WHERE is_read = false;

-- Add some constraints for data integrity
ALTER TABLE public.recipes ADD CONSTRAINT check_prep_time_positive 
CHECK (prep_time IS NULL OR prep_time >= 0);

ALTER TABLE public.recipes ADD CONSTRAINT check_cooking_time_positive 
CHECK (cooking_time IS NULL OR cooking_time >= 0);

ALTER TABLE public.recipes ADD CONSTRAINT check_servings_positive 
CHECK (servings IS NULL OR servings > 0);

ALTER TABLE public.recipes ADD CONSTRAINT check_calories_positive 
CHECK (calories_per_serving IS NULL OR calories_per_serving >= 0);

-- Add comment for database version
COMMENT ON SCHEMA public IS 'Ne Yesek AI Database - Version 1.0 - Created on 2025-07-10';
