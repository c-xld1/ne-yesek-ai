-- Add missing columns to questions table
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS author_reputation INTEGER DEFAULT 0;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS is_solved BOOLEAN DEFAULT false;

-- Add missing columns to answers table
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS is_best_answer BOOLEAN DEFAULT false;

-- Create question_views table
CREATE TABLE IF NOT EXISTS public.question_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(question_id, user_id)
);

ALTER TABLE public.question_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Question views are viewable by everyone" 
  ON public.question_views FOR SELECT USING (true);

CREATE POLICY "Anyone can insert question views" 
  ON public.question_views FOR INSERT WITH CHECK (true);