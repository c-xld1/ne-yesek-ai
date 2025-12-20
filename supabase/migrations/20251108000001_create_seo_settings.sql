-- Create SEO Settings Table
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  page_title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  canonical_url TEXT,
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  priority DECIMAL(2,1) DEFAULT 0.5,
  changefreq TEXT DEFAULT 'weekly',
  schema_type TEXT,
  schema_data JSONB,
  custom_meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to seo_settings" ON seo_settings;
DROP POLICY IF EXISTS "Allow admin users to manage seo_settings" ON seo_settings;

-- Allow public read access
CREATE POLICY "Allow public read access to seo_settings"
  ON seo_settings FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users with admin role to manage (using the is_admin function)
CREATE POLICY "Allow admin users to manage seo_settings"
  ON seo_settings FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_key ON seo_settings(page_key);

-- Insert default SEO settings
INSERT INTO seo_settings (page_key, page_title, meta_title, meta_description, meta_keywords, priority, changefreq) VALUES
('home', 'Ana Sayfa', 'Ne Yesek AI - Yapay Zeka Destekli Tarif Platformu', 'Milyonlarca tarif, AI destekli kişisel öneriler ve mutfak deneyiminizi kolaylaştıran teknoloji.', 'tarif, yemek tarifi, mutfak, ai tarif, yapay zeka, ne yesek', 1.0, 'daily'),
('recipes', 'Tarifler', 'Yemek Tarifleri - Ne Yesek AI', 'Binlerce lezzetli yemek tarifi. Kolay tariflerden gurme yemeklere kadar geniş tarif arşivi.', 'yemek tarifleri, kolay tarifler, pratik yemekler, tarif arşivi', 0.9, 'daily'),
('blog', 'Blog', 'Mutfak Blogu - Ne Yesek AI', 'Mutfak dünyasından en güncel haberler, ipuçları ve uzman görüşleri.', 'mutfak blogu, yemek yazıları, mutfak ipuçları, beslenme', 0.9, 'daily'),
('categories', 'Kategoriler', 'Tarif Kategorileri - Ne Yesek AI', 'Ana yemekler, tatlılar, çorbalar ve daha fazlası. Kategorilere göre tarifleri keşfedin.', 'tarif kategorileri, yemek türleri, mutfak kategorileri', 0.8, 'weekly'),
('about', 'Hakkımızda', 'Hakkımızda - Ne Yesek AI', 'Ne Yesek AI hakkında bilgi edinin. Vizyonumuz, misyonumuz ve ekibimiz.', 'hakkımızda, ne yesek ai, ekip, vizyon', 0.6, 'monthly'),
('contact', 'İletişim', 'İletişim - Ne Yesek AI', 'Bize ulaşın. Sorularınız, önerileriniz ve işbirliği teklifleriniz için iletişime geçin.', 'iletişim, destek, bize ulaşın', 0.6, 'monthly')
ON CONFLICT (page_key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_seo_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_settings_updated_at();
