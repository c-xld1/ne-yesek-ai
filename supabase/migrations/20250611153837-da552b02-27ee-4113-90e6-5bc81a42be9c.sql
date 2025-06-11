
-- First, let's add categories (this should work fine)
INSERT INTO public.categories (name, slug, icon, color, description) VALUES
('Ana Yemek', 'ana-yemek', '🍖', '#f59e0b', 'Et, sebze ve tahıl bazlı ana yemekler'),
('Tatlı', 'tatli', '🍰', '#ec4899', 'Şerbetli, sütlü ve hamur tatlıları'),
('Çorba', 'corba', '🍲', '#10b981', 'Sıcak ve soğuk çorbalar'),
('Salata', 'salata', '🥗', '#22c55e', 'Taze sebze ve meyve salatalar'),
('Aperitif', 'aperitif', '🥂', '#8b5cf6', 'Başlangıç ve mezeler'),
('İçecek', 'icecek', '🧃', '#06b6d4', 'Sıcak ve soğuk içecekler')
ON CONFLICT (name) DO NOTHING;

-- Add sample recipes without author_id (anonymous recipes)
INSERT INTO public.recipes (
  title, 
  description, 
  category_id,
  difficulty,
  cooking_time,
  prep_time,
  servings,
  image_url,
  ingredients,
  instructions
) 
SELECT * FROM (VALUES
(
  'Klasik Karnıyarık',
  'Geleneksel Türk mutfağının vazgeçilmez lezzeti. Patlıcanın içi kıyma ile doldurularak fırında pişirilir.',
  (SELECT id FROM categories WHERE slug = 'ana-yemek' LIMIT 1),
  'Orta',
  '45 dakika',
  '30 dakika',
  4,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
  '[
    {"name": "Patlıcan", "amount": "4 adet", "category": "sebze"},
    {"name": "Kıyma", "amount": "300 gr", "category": "et"},
    {"name": "Soğan", "amount": "2 adet", "category": "sebze"},
    {"name": "Domates", "amount": "2 adet", "category": "sebze"},
    {"name": "Salça", "amount": "2 yemek kaşığı", "category": "sos"},
    {"name": "Zeytinyağı", "amount": "4 yemek kaşığı", "category": "yağ"}
  ]'::jsonb,
  '[
    {"step": 1, "instruction": "Patlıcanları boydan ikiye kesin ve tuzlu suda bekletin."},
    {"step": 2, "instruction": "Soğanları doğrayın ve yağda kavurun."},
    {"step": 3, "instruction": "Kıymayı ekleyip kavurun, salça ve baharatları ilave edin."},
    {"step": 4, "instruction": "Patlıcanların içini oyun ve harcı doldurun."},
    {"step": 5, "instruction": "180 derece fırında 30 dakika pişirin."}
  ]'::jsonb
),
(
  'Mercimek Çorbası',
  'Besleyici ve lezzetli, Türk mutfağının en sevilen çorbalarından biri.',
  (SELECT id FROM categories WHERE slug = 'corba' LIMIT 1),
  'Kolay',
  '25 dakika',
  '10 dakika',
  6,
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop',
  '[
    {"name": "Kırmızı mercimek", "amount": "1 su bardağı", "category": "bakliyat"},
    {"name": "Soğan", "amount": "1 adet", "category": "sebze"},
    {"name": "Havuç", "amount": "1 adet", "category": "sebze"},
    {"name": "Salça", "amount": "1 yemek kaşığı", "category": "sos"},
    {"name": "Tereyağı", "amount": "2 yemek kaşığı", "category": "yağ"}
  ]'::jsonb,
  '[
    {"step": 1, "instruction": "Mercimekleri yıkayın ve tencereye alın."},
    {"step": 2, "instruction": "Üzerine su ekleyip kaynatın."},
    {"step": 3, "instruction": "Soğan ve havuçları doğrayıp ekleyin."},
    {"step": 4, "instruction": "Mercimekler yumuşayınca blenderdan geçirin."},
    {"step": 5, "instruction": "Tereyağında salçayı kavurup çorbaya ekleyin."}
  ]'::jsonb
),
(
  'Sütlaç',
  'Fırında pişen geleneksel Türk tatlısı. Üzeri karamelize olmuş, kreması yoğun.',
  (SELECT id FROM categories WHERE slug = 'tatli' LIMIT 1),
  'Orta',
  '50 dakika',
  '15 dakika',
  8,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
  '[
    {"name": "Süt", "amount": "1 litre", "category": "süt ürünü"},
    {"name": "Pirinç", "amount": "3/4 su bardağı", "category": "tahıl"},
    {"name": "Şeker", "amount": "3/4 su bardağı", "category": "tatlandırıcı"},
    {"name": "Nişasta", "amount": "2 yemek kaşığı", "category": "katkı"},
    {"name": "Vanilya", "amount": "1 paket", "category": "baharat"}
  ]'::jsonb,
  '[
    {"step": 1, "instruction": "Pirinci haşlayın ve süzün."},
    {"step": 2, "instruction": "Sütü kaynatın, pirinci ekleyin."},
    {"step": 3, "instruction": "Şeker ve vanilya ekleyip karıştırın."},
    {"step": 4, "instruction": "Nişastayı soğuk sütle açıp ekleyin."},
    {"step": 5, "instruction": "Fırın kabına alıp 200 derece fırında pişirin."}
  ]'::jsonb
),
(
  'Çoban Salatası',
  'Taze sebzelerle hazırlanan klasik Türk salatası. Yaz aylarının vazgeçilmezi.',
  (SELECT id FROM categories WHERE slug = 'salata' LIMIT 1),
  'Kolay',
  '15 dakika',
  '15 dakika',
  4,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
  '[
    {"name": "Domates", "amount": "3 adet", "category": "sebze"},
    {"name": "Salatalık", "amount": "2 adet", "category": "sebze"},
    {"name": "Soğan", "amount": "1 adet", "category": "sebze"},
    {"name": "Maydanoz", "amount": "1 demet", "category": "yeşillik"},
    {"name": "Zeytinyağı", "amount": "3 yemek kaşığı", "category": "yağ"},
    {"name": "Limon suyu", "amount": "1 adet", "category": "meyve"}
  ]'::jsonb,
  '[
    {"step": 1, "instruction": "Domatesleri küp küp doğrayın."},
    {"step": 2, "instruction": "Salatalıkları dilimleyin."},
    {"step": 3, "instruction": "Soğanı ince ince doğrayın."},
    {"step": 4, "instruction": "Maydanozu ince kıyın."},
    {"step": 5, "instruction": "Tüm malzemeleri karıştırıp zeytinyağı ve limon ekleyin."}
  ]'::jsonb
),
(
  'Tavuk Şiş',
  'Mangalda pişirilmiş lezzetli tavuk şiş tarifi.',
  (SELECT id FROM categories WHERE slug = 'ana-yemek' LIMIT 1),
  'Kolay',
  '20 dakika',
  '2 saat',
  4,
  'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop',
  '[
    {"name": "Tavuk göğsü", "amount": "500 gr", "category": "et"},
    {"name": "Yoğurt", "amount": "1 su bardağı", "category": "süt ürünü"},
    {"name": "Zeytinyağı", "amount": "2 yemek kaşığı", "category": "yağ"},
    {"name": "Sarımsak", "amount": "3 diş", "category": "sebze"},
    {"name": "Kırmızı biber", "amount": "1 tatlı kaşığı", "category": "baharat"}
  ]'::jsonb,
  '[
    {"step": 1, "instruction": "Tavuk etini küp küp doğrayın."},
    {"step": 2, "instruction": "Yoğurt, zeytinyağı ve baharatları karıştırın."},
    {"step": 3, "instruction": "Tavukları marine karışımında 2 saat bekletin."},
    {"step": 4, "instruction": "Şişlere dizin ve mangalda pişirin."},
    {"step": 5, "instruction": "Sıcak servis yapın."}
  ]'::jsonb
),
(
  'Türk Kahvesi',
  'Geleneksel Türk kahvesi yapım tarifi.',
  (SELECT id FROM categories WHERE slug = 'icecek' LIMIT 1),
  'Kolay',
  '10 dakika',
  '5 dakika',
  2,
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop',
  '[
    {"name": "Türk kahvesi", "amount": "2 tatlı kaşığı", "category": "içecek"},
    {"name": "Su", "amount": "2 fincan", "category": "sıvı"},
    {"name": "Şeker", "amount": "isteğe göre", "category": "tatlandırıcı"}
  ]'::jsonb,
  '[
    {"step": 1, "instruction": "Cezvede suyu kaynatın."},
    {"step": 2, "instruction": "Kahve ve şekeri ekleyin."},
    {"step": 3, "instruction": "Karıştırarak pişirin."},
    {"step": 4, "instruction": "Köpük çıkınca ateşten alın."},
    {"step": 5, "instruction": "Fincanları paylaştırarak servis edin."}
  ]'::jsonb
)
) AS new_recipes(title, description, category_id, difficulty, cooking_time, prep_time, servings, image_url, ingredients, instructions)
WHERE NOT EXISTS (
  SELECT 1 FROM recipes WHERE recipes.title = new_recipes.title
);
