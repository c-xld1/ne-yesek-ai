
-- Insert sample video stories
DO $$
DECLARE
  sample_user_id uuid;
  recipe_ids uuid[];
BEGIN
  -- Get sample user
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;
  
  -- Get some recipe IDs
  SELECT ARRAY_AGG(id) INTO recipe_ids FROM recipes LIMIT 5;
  
  -- Insert video stories
  INSERT INTO video_stories (title, description, video_url, thumbnail_url, user_id, recipe_id, duration, views, likes, is_featured)
  VALUES
  ('Mercimek Çorbası 30 Saniyede', 'Hızlı ve kolay mercimek çorbası tarifi', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', sample_user_id, recipe_ids[1], 30, 2500, 150, true),
  ('Menemen Nasıl Yapılır?', 'Kahvaltının vazgeçilmezi menemen', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', sample_user_id, recipe_ids[2], 45, 3200, 280, true),
  ('Baklava Açma Teknikleri', 'Usta şeften baklava sırları', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400', sample_user_id, recipe_ids[3], 60, 5100, 420, true),
  ('İmam Bayıldı 1 Dakikada', 'Zeytinyağlı patlıcan', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', sample_user_id, recipe_ids[4], 60, 1800, 95, false),
  ('Gözleme Hamuru İpuçları', 'Ev yapımı gözleme', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400', sample_user_id, recipe_ids[5], 50, 2100, 160, true);
END $$;
