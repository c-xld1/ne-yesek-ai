-- Kurye rolleri için enum
DO $$ BEGIN
    CREATE TYPE public.courier_status AS ENUM ('available', 'busy', 'offline', 'break');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.delivery_type AS ENUM ('instant', 'scheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Chef profiles'a ek alanlar ekle
ALTER TABLE public.chef_profiles 
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_female boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 100,
ADD COLUMN IF NOT EXISTS daily_order_limit integer DEFAULT 20,
ADD COLUMN IF NOT EXISTS current_daily_orders integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_prep_time integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'available',
ADD COLUMN IF NOT EXISTS ai_status_label text DEFAULT 'Yeni Şef',
ADD COLUMN IF NOT EXISTS total_earnings numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS commission_rate numeric DEFAULT 0.15;

-- Kuryeler tablosu
CREATE TABLE IF NOT EXISTS public.couriers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    fullname text NOT NULL,
    phone text NOT NULL,
    avatar_url text,
    status courier_status DEFAULT 'offline',
    current_latitude numeric,
    current_longitude numeric,
    vehicle_type text DEFAULT 'motorcycle',
    is_active boolean DEFAULT true,
    trust_score numeric DEFAULT 100,
    total_deliveries integer DEFAULT 0,
    avg_delivery_time integer DEFAULT 25,
    current_load integer DEFAULT 0,
    max_load integer DEFAULT 3,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;

-- Kurye rotaları
CREATE TABLE IF NOT EXISTS public.courier_routes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    courier_id uuid REFERENCES public.couriers(id) ON DELETE CASCADE,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    pickup_latitude numeric NOT NULL,
    pickup_longitude numeric NOT NULL,
    delivery_latitude numeric NOT NULL,
    delivery_longitude numeric NOT NULL,
    estimated_pickup_time timestamp with time zone,
    actual_pickup_time timestamp with time zone,
    estimated_delivery_time timestamp with time zone,
    actual_delivery_time timestamp with time zone,
    distance_km numeric,
    status text DEFAULT 'pending',
    route_order integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.courier_routes ENABLE ROW LEVEL SECURITY;

-- Cüzdanlar
CREATE TABLE IF NOT EXISTS public.wallets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    balance numeric DEFAULT 0,
    pending_balance numeric DEFAULT 0,
    total_earned numeric DEFAULT 0,
    total_withdrawn numeric DEFAULT 0,
    currency text DEFAULT 'TRY',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Cüzdan işlemleri
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id uuid REFERENCES public.wallets(id) ON DELETE CASCADE,
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    type text NOT NULL,
    amount numeric NOT NULL,
    description text,
    status text DEFAULT 'completed',
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Sipariş durum logları
CREATE TABLE IF NOT EXISTS public.order_status_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    status text NOT NULL,
    changed_by uuid,
    notes text,
    latitude numeric,
    longitude numeric,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;

-- AI önerileri
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    chef_id uuid REFERENCES public.chef_profiles(id) ON DELETE CASCADE,
    recommendation_type text NOT NULL,
    reason text NOT NULL,
    score numeric DEFAULT 0,
    factors jsonb,
    is_shown boolean DEFAULT false,
    is_clicked boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Güven skorları geçmişi
CREATE TABLE IF NOT EXISTS public.trust_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    score numeric NOT NULL,
    factors jsonb,
    calculated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;

-- Teslimat slotları
CREATE TABLE IF NOT EXISTS public.delivery_slots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chef_id uuid REFERENCES public.chef_profiles(id) ON DELETE CASCADE,
    slot_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    max_orders integer DEFAULT 5,
    current_orders integer DEFAULT 0,
    is_active boolean DEFAULT true,
    delivery_type delivery_type DEFAULT 'scheduled',
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.delivery_slots ENABLE ROW LEVEL SECURITY;

-- Orders tablosuna ek alanlar
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS courier_id uuid REFERENCES public.couriers(id),
ADD COLUMN IF NOT EXISTS slot_id uuid REFERENCES public.delivery_slots(id),
ADD COLUMN IF NOT EXISTS ai_assigned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS estimated_delivery_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS actual_delivery_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivery_latitude numeric,
ADD COLUMN IF NOT EXISTS delivery_longitude numeric,
ADD COLUMN IF NOT EXISTS delay_risk_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_notes text;

-- RLS Policies
CREATE POLICY "Couriers viewable by everyone" ON public.couriers FOR SELECT USING (true);
CREATE POLICY "Couriers can update own profile" ON public.couriers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage couriers" ON public.couriers FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Courier routes viewable by participants" ON public.courier_routes FOR SELECT 
USING (EXISTS (SELECT 1 FROM couriers WHERE couriers.id = courier_id AND couriers.user_id = auth.uid()) OR 
       EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.customer_id = auth.uid()));

CREATE POLICY "Wallets viewable by owner" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Wallets updatable by system" ON public.wallets FOR UPDATE USING (true);
CREATE POLICY "Wallets insertable" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Wallet transactions viewable by owner" ON public.wallet_transactions FOR SELECT 
USING (EXISTS (SELECT 1 FROM wallets WHERE wallets.id = wallet_id AND wallets.user_id = auth.uid()));

CREATE POLICY "Order logs viewable by participants" ON public.order_status_logs FOR SELECT 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND (orders.customer_id = auth.uid() OR 
       EXISTS (SELECT 1 FROM chef_profiles WHERE chef_profiles.id = orders.chef_id AND chef_profiles.user_id = auth.uid()))));
CREATE POLICY "Order logs insertable" ON public.order_status_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "AI recommendations viewable by user" ON public.ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "AI recommendations insertable" ON public.ai_recommendations FOR INSERT WITH CHECK (true);

CREATE POLICY "Trust scores viewable by everyone" ON public.trust_scores FOR SELECT USING (true);
CREATE POLICY "Trust scores insertable" ON public.trust_scores FOR INSERT WITH CHECK (true);

CREATE POLICY "Delivery slots viewable by everyone" ON public.delivery_slots FOR SELECT USING (true);
CREATE POLICY "Chefs can manage own slots" ON public.delivery_slots FOR ALL 
USING (EXISTS (SELECT 1 FROM chef_profiles WHERE chef_profiles.id = chef_id AND chef_profiles.user_id = auth.uid()));

-- Örnek veriler
INSERT INTO public.delivery_slots (chef_id, slot_date, start_time, end_time, max_orders, delivery_type) 
SELECT id, CURRENT_DATE, '12:00', '14:00', 5, 'scheduled' FROM public.chef_profiles WHERE is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO public.delivery_slots (chef_id, slot_date, start_time, end_time, max_orders, delivery_type) 
SELECT id, CURRENT_DATE, '18:00', '21:00', 8, 'scheduled' FROM public.chef_profiles WHERE is_active = true
ON CONFLICT DO NOTHING;