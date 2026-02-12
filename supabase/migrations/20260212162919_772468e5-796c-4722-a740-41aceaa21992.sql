
-- Fix profiles RLS: allow users to insert and update their own profiles
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Fix categories RLS: allow admins to manage categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create site_settings table for admin settings persistence
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('general', '{"siteName": "Ne Yesek AI", "siteDescription": "Yapay zeka destekli yemek tarifi platformu", "contactEmail": "info@neyesek.ai", "phone": "", "address": ""}'::jsonb),
  ('social', '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}'::jsonb),
  ('maintenance', '{"enabled": false, "message": "Site bakımda. Lütfen daha sonra tekrar deneyiniz.", "allowedIPs": ""}'::jsonb),
  ('notifications', '{"newOrder": true, "chefApplication": true, "newUser": false, "weeklyReport": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
