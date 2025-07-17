-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can create categories" 
ON public.categories FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update categories" 
ON public.categories FOR UPDATE 
TO authenticated 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);
CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS categories_is_active_idx ON public.categories(is_active);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Ana Yemekler', 'ana-yemekler', 'Et, tavuk, balık ve diğer ana yemek tarifleri', 1),
('Çorbalar', 'corbalar', 'Sıcak ve soğuk çorba tarifleri', 2),
('Salatalar', 'salatalar', 'Taze ve lezzetli salata tarifleri', 3),
('Tatlılar', 'tatlilar', 'Geleneksel ve modern tatlı tarifleri', 4),
('Atıştırmalıklar', 'atistirmaliklar', 'Pratik atıştırmalık ve meze tarifleri', 5),
('İçecekler', 'icecekler', 'Sıcak ve soğuk içecek tarifleri', 6),
('Kahvaltı', 'kahvalti', 'Kahvaltı ve brunch tarifleri', 7),
('Vejeteryan', 'vejeteryan', 'Et içermeyen lezzetli tarifler', 8),
('Vegan', 'vegan', 'Tamamen bitkisel tarifler', 9),
('Diyet', 'diyet', 'Sağlıklı ve düşük kalorili tarifler', 10)
ON CONFLICT (slug) DO NOTHING;
