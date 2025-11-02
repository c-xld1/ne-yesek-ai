-- Chef Applications (Şef Başvuruları)
CREATE TABLE IF NOT EXISTS public.chef_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fullname TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  cuisine_type TEXT NOT NULL,
  experience_years INTEGER,
  business_description TEXT,
  sample_menu JSONB,
  identity_document_url TEXT,
  residence_document_url TEXT,
  video_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chef Earnings (Şef Kazançları)
CREATE TABLE IF NOT EXISTS public.chef_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id UUID NOT NULL REFERENCES public.chef_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing')),
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chef Availability (Çalışma Saatleri)
CREATE TABLE IF NOT EXISTS public.chef_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id UUID NOT NULL REFERENCES public.chef_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (Değerlendirmeler)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  chef_id UUID NOT NULL REFERENCES public.chef_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chef_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chef_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chef_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chef_applications
CREATE POLICY "Users can view own applications"
  ON public.chef_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON public.chef_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
  ON public.chef_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications"
  ON public.chef_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for chef_earnings
CREATE POLICY "Chefs can view own earnings"
  ON public.chef_earnings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.chef_profiles
    WHERE chef_profiles.id = chef_earnings.chef_id
    AND chef_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all earnings"
  ON public.chef_earnings FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage earnings"
  ON public.chef_earnings FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for chef_availability
CREATE POLICY "Everyone can view availability"
  ON public.chef_availability FOR SELECT
  USING (true);

CREATE POLICY "Chefs can manage own availability"
  ON public.chef_availability FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.chef_profiles
    WHERE chef_profiles.id = chef_availability.chef_id
    AND chef_profiles.user_id = auth.uid()
  ));

-- RLS Policies for reviews
CREATE POLICY "Everyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their orders"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_id
      AND orders.customer_id = auth.uid()
      AND orders.status = 'delivered'
    )
  );

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Update trigger for chef_applications
CREATE TRIGGER update_chef_applications_updated_at
  BEFORE UPDATE ON public.chef_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();