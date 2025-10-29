-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  subscribed_at timestamp with time zone DEFAULT now(),
  unsubscribed_at timestamp with time zone DEFAULT NULL
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Newsletter subscribers are viewable by admins only
CREATE POLICY "Admins can view all subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Users can unsubscribe themselves
CREATE POLICY "Users can unsubscribe"
ON public.newsletter_subscribers
FOR UPDATE
USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_recipe_favorites_user_id ON public.recipe_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_favorites_recipe_id ON public.recipe_favorites(recipe_id);