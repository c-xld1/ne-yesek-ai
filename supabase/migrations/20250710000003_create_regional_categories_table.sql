-- Create regional_categories table
CREATE TABLE IF NOT EXISTS public.regional_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    country_code TEXT,
    region TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.regional_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Regional categories are viewable by everyone" 
ON public.regional_categories FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can create regional categories" 
ON public.regional_categories FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update regional categories" 
ON public.regional_categories FOR UPDATE 
TO authenticated 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER regional_categories_updated_at
    BEFORE UPDATE ON public.regional_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS regional_categories_slug_idx ON public.regional_categories(slug);
CREATE INDEX IF NOT EXISTS regional_categories_country_code_idx ON public.regional_categories(country_code);
CREATE INDEX IF NOT EXISTS regional_categories_region_idx ON public.regional_categories(region);
CREATE INDEX IF NOT EXISTS regional_categories_sort_order_idx ON public.regional_categories(sort_order);

-- Insert default regional categories
INSERT INTO public.regional_categories (name, slug, description, country_code, region, sort_order) VALUES
('Türk Mutfağı', 'turk-mutfagi', 'Geleneksel Türk yemekleri', 'TR', 'Türkiye', 1),
('Akdeniz Mutfağı', 'akdeniz-mutfagi', 'Akdeniz bölgesi yemekleri', 'TR', 'Akdeniz', 2),
('Ege Mutfağı', 'ege-mutfagi', 'Ege bölgesi yemekleri', 'TR', 'Ege', 3),
('Karadeniz Mutfağı', 'karadeniz-mutfagi', 'Karadeniz bölgesi yemekleri', 'TR', 'Karadeniz', 4),
('İç Anadolu Mutfağı', 'ic-anadolu-mutfagi', 'İç Anadolu bölgesi yemekleri', 'TR', 'İç Anadolular', 5),
('Doğu Anadolu Mutfağı', 'dogu-anadolu-mutfagi', 'Doğu Anadolu bölgesi yemekleri', 'TR', 'Doğu Anadolular', 6),
('Güneydoğu Anadolu Mutfağı', 'guneydogu-anadolu-mutfagi', 'Güneydoğu Anadolu bölgesi yemekleri', 'TR', 'Güneydoğu Anadolular', 7),
('İtalyan Mutfağı', 'italyan-mutfagi', 'İtalyan yemekleri', 'IT', 'İtalya', 8),
('Fransız Mutfağı', 'fransiz-mutfagi', 'Fransız yemekleri', 'FR', 'Fransa', 9),
('Uzak Doğu Mutfağı', 'uzak-dogu-mutfagi', 'Asya mutfağı', 'AS', 'Asya', 10)
ON CONFLICT (slug) DO NOTHING;
