
-- Insert sample categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Çorbalar', 'corbalar', 'Sıcacık ve besleyici çorba tarifleri', '🥣'),
('Kahvaltı', 'kahvalti', 'Güne enerjik başlayacağınız kahvaltılık tarifler', '☕'),
('Ana Yemekler', 'ana-yemekler', 'Doyurucu ve lezzetli ana yemek tarifleri', '🍽️'),
('Tatlılar', 'tatlilar', 'Tatlı krizlerinize çözüm tarifler', '🍰'),
('Salatalar', 'salatalar', 'Hafif ve sağlıklı salata tarifleri', '🥗'),
('Mezeler', 'mezeler', 'Sofralarınızı süsleyecek mezeler', '🧆')
ON CONFLICT (slug) DO NOTHING;
