-- Add draft support to recipes table
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS is_draft boolean DEFAULT false;

-- Create recipe_comments table
CREATE TABLE IF NOT EXISTS public.recipe_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on recipe_comments
ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for recipe_comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.recipe_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.recipe_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" 
ON public.recipe_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
ON public.recipe_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at on comments
CREATE TRIGGER update_recipe_comments_updated_at
BEFORE UPDATE ON public.recipe_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Update recipes policy to allow drafts
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
DROP POLICY IF EXISTS "Published recipes are viewable by everyone" ON public.recipes;
CREATE POLICY "Published recipes are viewable by everyone" 
ON public.recipes 
FOR SELECT 
USING (is_draft = false OR auth.uid() = author_id);