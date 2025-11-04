
-- Insert sample recipes for each category
-- Get first profile for sample recipes
DO $$
DECLARE
  sample_user_id uuid;
  corba_cat_id uuid;
  kahvalti_cat_id uuid;
  ana_yemek_cat_id uuid;
  tatli_cat_id uuid;
  salata_cat_id uuid;
  meze_cat_id uuid;
BEGIN
  -- Get sample user
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;
  
  -- Get category IDs
  SELECT id INTO corba_cat_id FROM categories WHERE slug = 'corbalar';
  SELECT id INTO kahvalti_cat_id FROM categories WHERE slug = 'kahvalti';
  SELECT id INTO ana_yemek_cat_id FROM categories WHERE slug = 'ana-yemekler';
  SELECT id INTO tatli_cat_id FROM categories WHERE slug = 'tatlilar';
  SELECT id INTO salata_cat_id FROM categories WHERE slug = 'salatalar';
  SELECT id INTO meze_cat_id FROM categories WHERE slug = 'mezeler';
  
  -- Çorbalar
  INSERT INTO recipes (title, description, image_url, category_id, user_id, difficulty, prep_time, cook_time, servings, rating, views, is_featured)
  VALUES
  ('Mercimek Çorbası', 'Türk mutfağının vazgeçilmez klasiği', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', corba_cat_id, sample_user_id, 'Kolay', 10, 20, 4, 4.8, 1200, true),
  ('Tarhana Çorbası', 'Geleneksel ve besleyici', 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400', corba_cat_id, sample_user_id, 'Kolay', 5, 15, 4, 4.7, 950, true),
  ('Ezogelin Çorbası', 'Baharatlı ve lezzetli', 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=400', corba_cat_id, sample_user_id, 'Kolay', 10, 25, 4, 4.6, 870, false);
  
  -- Kahvaltı
  INSERT INTO recipes (title, description, image_url, category_id, user_id, difficulty, prep_time, cook_time, servings, rating, views, is_featured)
  VALUES
  ('Menemen', 'Klasik Türk kahvaltısı', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', kahvalti_cat_id, sample_user_id, 'Kolay', 5, 10, 2, 4.9, 1500, true),
  ('Gözleme', 'El yapımı ince hamur', 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400', kahvalti_cat_id, sample_user_id, 'Orta', 30, 20, 4, 4.8, 1350, true),
  ('Simit', 'Taze fırından', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', kahvalti_cat_id, sample_user_id, 'Zor', 120, 25, 8, 4.7, 980, false);
  
  -- Ana Yemekler
  INSERT INTO recipes (title, description, image_url, category_id, user_id, difficulty, prep_time, cook_time, servings, rating, views, is_featured)
  VALUES
  ('İmam Bayıldı', 'Zeytinyağlı patlıcan yemeği', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', ana_yemek_cat_id, sample_user_id, 'Orta', 20, 40, 4, 4.9, 1800, true),
  ('Karnıyarık', 'Kıymalı patlıcan dolması', 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400', ana_yemek_cat_id, sample_user_id, 'Orta', 25, 45, 4, 4.8, 1650, true),
  ('Mantı', 'El açması Türk mantısı', 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400', ana_yemek_cat_id, sample_user_id, 'Zor', 90, 30, 6, 5.0, 2100, true);
  
  -- Tatlılar
  INSERT INTO recipes (title, description, image_url, category_id, user_id, difficulty, prep_time, cook_time, servings, rating, views, is_featured)
  VALUES
  ('Baklava', 'Fıstıklı geleneksel baklava', 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400', tatli_cat_id, sample_user_id, 'Zor', 60, 45, 12, 5.0, 2500, true),
  ('Sütlaç', 'Fırında sütlaç', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', tatli_cat_id, sample_user_id, 'Kolay', 10, 40, 6, 4.7, 1400, true),
  ('Kazandibi', 'Osmanlı tatlısı', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', tatli_cat_id, sample_user_id, 'Orta', 15, 50, 8, 4.8, 1100, false);
  
  -- Salatalar
  INSERT INTO recipes (title, description, image_url, category_id, user_id, difficulty, prep_time, cook_time, servings, rating, views, is_featured)
  VALUES
  ('Çoban Salata', 'Taze sebzelerle', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', salata_cat_id, sample_user_id, 'Kolay', 15, 0, 4, 4.6, 800, true),
  ('Mevsim Salata', 'Renkli ve sağlıklı', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', salata_cat_id, sample_user_id, 'Kolay', 10, 0, 4, 4.5, 720, false);
  
  -- Mezeler
  INSERT INTO recipes (title, description, image_url, category_id, user_id, difficulty, prep_time, cook_time, servings, rating, views, is_featured)
  VALUES
  ('Humus', 'Nohutlu meze', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', meze_cat_id, sample_user_id, 'Kolay', 20, 0, 6, 4.7, 950, true),
  ('Cacık', 'Yoğurtlu meze', 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bb?w=400', meze_cat_id, sample_user_id, 'Kolay', 10, 0, 4, 4.8, 1100, true),
  ('Patlıcan Salatası', 'Közlenmiş patlıcan', 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400', meze_cat_id, sample_user_id, 'Orta', 15, 20, 6, 4.6, 880, false);
END $$;
