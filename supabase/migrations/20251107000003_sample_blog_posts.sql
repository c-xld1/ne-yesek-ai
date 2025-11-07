-- Test blog posts for demonstration

-- First, get a sample user ID (you'll need to replace this with actual user IDs from your system)
-- This is just sample data, admin should use the UI to create real posts

-- Sample blog post 1: Mutfak İpuçları
INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  featured,
  published,
  image_url,
  author_id,
  read_time
) VALUES (
  'Mutfakta Zaman Kazandıran 10 İpucu',
  'mutfakta-zaman-kazandiran-10-ipucu',
  'Mutfakta işlerinizi hızlandıracak ve hayatınızı kolaylaştıracak pratik ipuçları.',
  '# Mutfakta Zaman Kazandıran 10 İpucu

Mutfakta geçirdiğimiz zamanı azaltmak ve daha verimli çalışmak için birçok küçük tüyo var. İşte size günlük mutfak rutininizi kolaylaştıracak 10 pratik ipucu:

## 1. Haftalık Menü Planlama
Haftanın başında menü planlaması yapmak hem alışverişi kolaylaştırır hem de her gün "ne pişirsem" stresinden kurtarır.

## 2. Malzemeleri Önceden Hazırlama
Sebzeleri yıkayıp doğradıktan sonra buzdolabında saklayabilirsiniz. Böylece yemek yaparken sadece pişirme işlemine odaklanırsınız.

## 3. Doğru Ekipman Kullanımı
Kaliteli bıçak, hızlı pişirici tencere gibi doğru araçlar kullanmak mutfakta geçirdiğiniz süreyi yarıya indirebilir.

## 4. Batch Cooking (Toplu Pişirme)
Hafta sonları birkaç yemeği birden pişirip porsiyon porsiyon dondurabilirsiniz.

## 5. Mis-en-place Prensibi
Pişirmeye başlamadan önce tüm malzemeleri hazırlayın ve önünüze dizin.

Diğer ipuçları için blogumuzu takip etmeye devam edin!',
  'Mutfak İpuçları',
  ARRAY['ipucu', 'mutfak', 'pratik', 'zaman-yönetimi'],
  true,
  true,
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
  (SELECT id FROM auth.users LIMIT 1),
  5
) ON CONFLICT (slug) DO NOTHING;

-- Sample blog post 2: Sağlıklı Beslenme
INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  featured,
  published,
  image_url,
  author_id,
  read_time
) VALUES (
  'Dengeli Beslenmenin Sırları',
  'dengeli-beslenmenin-sirlari',
  'Sağlıklı ve dengeli beslenme için bilmeniz gereken temel prensipler.',
  '# Dengeli Beslenmenin Sırları

Dengeli beslenme, vücudumuzun ihtiyacı olan tüm besin öğelerini yeterli miktarda almak demektir. Peki dengeli beslenmek için ne yapmalıyız?

## Tabak Modeli
Öğünlerinizde:
- %50 sebze ve meyve
- %25 protein
- %25 kompleks karbonhidrat

bulunmasına dikkat edin.

## Su Tüketimi
Günde en az 2-2.5 litre su için.

## Öğün Düzeni
Gün içinde 3 ana 2-3 ara öğün tüketin.

Sağlıklı beslenme alışkanlıkları kazanmak zaman alır ama bunun için hiç geç değil!',
  'Beslenme',
  ARRAY['sağlık', 'beslenme', 'diyet', 'sağlıklı-yaşam'],
  false,
  true,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
  (SELECT id FROM auth.users LIMIT 1),
  4
) ON CONFLICT (slug) DO NOTHING;

-- Sample blog post 3: Dünya Mutfakları
INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  featured,
  published,
  image_url,
  author_id,
  read_time
) VALUES (
  'İtalyan Mutfağı: Pasta Yapımının İncelikleri',
  'italyan-mutfagi-pasta-yapiminin-incelikleri',
  'Evde profesyonel İtalyan pastası yapmanın püf noktalarını öğrenin.',
  '# İtalyan Mutfağı: Pasta Yapımının İncelikleri

İtalyan mutfağının vazgeçilmezi pasta, aslında evde de kolayca yapılabilir. İşte size evde pasta yapmanın sırları:

## Doğru Un Seçimi
İtalyan pastası için "00" tipi un kullanmak en iyisidir. Bu un çok ince öğütülmüştür ve pasta hamuruna mükemmel bir doku verir.

## Yumurta Oranı
Klasik tarif: 100gr una 1 yumurta

## Yoğurma Tekniği
Hamuru en az 10 dakika yoğurun ve 30 dakika dinlendirin.

## Pişirme Sırları
- Bol tuzlu suda kaynatın
- Al dente pişirin
- Süzdükten hemen sonra sosla karıştırın

Afiyet olsun!',
  'Dünya Mutfakları',
  ARRAY['italyan', 'pasta', 'dünya-mutfakları', 'tarif'],
  false,
  true,
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=400&fit=crop',
  (SELECT id FROM auth.users LIMIT 1),
  6
) ON CONFLICT (slug) DO NOTHING;

-- Add some sample comments
INSERT INTO public.blog_comments (
  post_id,
  user_id,
  content
) SELECT 
  bp.id,
  (SELECT id FROM auth.users ORDER BY random() LIMIT 1),
  'Çok faydalı bir yazı olmuş, teşekkürler!'
FROM public.blog_posts bp
WHERE bp.slug = 'mutfakta-zaman-kazandiran-10-ipucu'
ON CONFLICT DO NOTHING;

INSERT INTO public.blog_comments (
  post_id,
  user_id,
  content
) SELECT 
  bp.id,
  (SELECT id FROM auth.users ORDER BY random() LIMIT 1),
  'Bu ipuçlarını deneyeceğim, harika!'
FROM public.blog_posts bp
WHERE bp.slug = 'dengeli-beslenmenin-sirlari'
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.blog_posts IS 'Sample blog posts added for demonstration';
