-- Add ready_now field to meals for instant delivery
ALTER TABLE public.meals ADD COLUMN IF NOT EXISTS ready_now boolean DEFAULT false;
ALTER TABLE public.meals ADD COLUMN IF NOT EXISTS ready_until timestamp with time zone;

-- Create scheduled orders table
CREATE TABLE IF NOT EXISTS public.scheduled_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id),
  chef_id uuid NOT NULL REFERENCES public.chef_profiles(id),
  meal_description text NOT NULL,
  servings integer NOT NULL DEFAULT 1,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  special_requests text,
  delivery_address text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.scheduled_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own scheduled orders"
ON public.scheduled_orders FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create scheduled orders"
ON public.scheduled_orders FOR INSERT
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Chefs can view their scheduled orders"
ON public.scheduled_orders FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.chef_profiles
  WHERE chef_profiles.id = scheduled_orders.chef_id
  AND chef_profiles.user_id = auth.uid()
));

CREATE POLICY "Chefs can update their scheduled orders"
ON public.scheduled_orders FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.chef_profiles
  WHERE chef_profiles.id = scheduled_orders.chef_id
  AND chef_profiles.user_id = auth.uid()
));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_meals_ready_now ON public.meals(ready_now) WHERE ready_now = true;
CREATE INDEX IF NOT EXISTS idx_scheduled_orders_date ON public.scheduled_orders(scheduled_date, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_chef_profiles_location ON public.chef_profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON public.messages(sender_id, receiver_id);