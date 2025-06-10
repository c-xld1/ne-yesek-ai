
-- Kullanıcı profilleri tablosu
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kategoriler tablosu
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#f3f4f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Koleksiyonlar tablosu (kullanıcıların tarif listelerini kaydetmeleri için)
CREATE TABLE public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favoriler tablosu
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Puanlamalar tablosu
CREATE TABLE public.ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Yorumlar tablosu
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Takip sistemi tablosu
CREATE TABLE public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Koleksiyon tarifleri bağlantı tablosu
CREATE TABLE public.collection_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES public.collections ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, recipe_id)
);

-- Recipes tablosuna kategori bağlantısı ekle
ALTER TABLE public.recipes ADD COLUMN category_id UUID REFERENCES public.categories;
ALTER TABLE public.recipes ADD COLUMN user_id UUID REFERENCES auth.users ON DELETE CASCADE;
ALTER TABLE public.recipes ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE public.recipes ADD COLUMN prep_time TEXT;
ALTER TABLE public.recipes ADD COLUMN total_time TEXT;
ALTER TABLE public.recipes ADD COLUMN servings INTEGER;
ALTER TABLE public.recipes ADD COLUMN calories_per_serving INTEGER;

-- Varsayılan kategorileri ekle
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Kahvaltı', 'kahvalti', 'Güne enerjik başlayacağınız kahvaltı tarifleri', '🍳'),
('Ana Yemek', 'ana-yemek', 'Doyurucu ve lezzetli ana yemek tarifleri', '🍽️'),
('Çorbalar', 'corbalar', 'Sıcacık ve besleyici çorba tarifleri', '🍲'),
('Tatlılar', 'tatlilar', 'Tatlı krizlerinizi giderecek nefis tarifler', '🧁'),
('15 Dakikada', '15-dakikada', 'Hızlı ve pratik tarifler', '⚡'),
('Vegan', 'vegan', 'Bitkisel beslenmeye uygun tarifler', '🌱'),
('Et Yemekleri', 'et-yemekleri', 'Et severler için özel tarifler', '🥩'),
('Deniz Ürünleri', 'deniz-urunleri', 'Taze deniz lezzetleri', '🐟'),
('Hamur İşleri', 'hamur-isleri', 'Ev yapımı ekmek ve hamur işleri', '🥖'),
('Salata & Mezeler', 'salata-mezeler', 'Taze ve sağlıklı tarifler', '🥗'),
('İçecekler', 'icecekler', 'Serinletici ve besleyici içecekler', '🥤'),
('Fit Tarifler', 'fit-tarifler', 'Sağlıklı yaşam için fit tarifler', '💪');

-- RLS politikalarını etkinleştir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_recipes ENABLE ROW LEVEL SECURITY;

-- Profiles RLS politikaları
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories RLS politikaları (herkese açık)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Collections RLS politikaları
CREATE POLICY "Users can view public collections and own collections" ON public.collections 
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create own collections" ON public.collections 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON public.collections 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON public.collections 
  FOR DELETE USING (auth.uid() = user_id);

-- Favorites RLS politikaları
CREATE POLICY "Users can view own favorites" ON public.favorites 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own favorites" ON public.favorites 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites 
  FOR DELETE USING (auth.uid() = user_id);

-- Ratings RLS politikaları
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create own ratings" ON public.ratings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.ratings 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.ratings 
  FOR DELETE USING (auth.uid() = user_id);

-- Comments RLS politikaları
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create own comments" ON public.comments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments 
  FOR DELETE USING (auth.uid() = user_id);

-- Follows RLS politikaları
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can create own follows" ON public.follows 
  FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete own follows" ON public.follows 
  FOR DELETE USING (auth.uid() = follower_id);

-- Collection recipes RLS politikaları
CREATE POLICY "Collection recipes viewable based on collection visibility" ON public.collection_recipes 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collections 
      WHERE collections.id = collection_recipes.collection_id 
      AND (collections.is_public = true OR collections.user_id = auth.uid())
    )
  );
CREATE POLICY "Users can manage own collection recipes" ON public.collection_recipes 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections 
      WHERE collections.id = collection_recipes.collection_id 
      AND collections.user_id = auth.uid()
    )
  );

-- Recipes tablosu için RLS politikaları ekle
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipes are viewable by everyone" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Users can create own recipes" ON public.recipes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON public.recipes 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.recipes 
  FOR DELETE USING (auth.uid() = user_id);

-- Profil oluşturma trigger'ı
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- View count artırma fonksiyonu
CREATE OR REPLACE FUNCTION public.increment_recipe_view_count(recipe_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.recipes 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = recipe_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
