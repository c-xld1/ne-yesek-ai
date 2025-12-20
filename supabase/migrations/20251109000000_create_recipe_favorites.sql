-- Create recipe_favorites table for storing user favorite recipes
CREATE TABLE IF NOT EXISTS public.recipe_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.recipe_favorites ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipe_favorites_user ON public.recipe_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_favorites_recipe ON public.recipe_favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_favorites_created ON public.recipe_favorites(created_at DESC);

-- RLS Policies
-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
    ON public.recipe_favorites
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites"
    ON public.recipe_favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can remove their own favorites"
    ON public.recipe_favorites
    FOR DELETE
    USING (auth.uid() = user_id);

-- Function to increment saves_count on recipes table
CREATE OR REPLACE FUNCTION public.increment_recipe_saves()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.recipes
    SET saves_count = saves_count + 1
    WHERE id = NEW.recipe_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement saves_count on recipes table
CREATE OR REPLACE FUNCTION public.decrement_recipe_saves()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.recipes
    SET saves_count = GREATEST(0, saves_count - 1)
    WHERE id = OLD.recipe_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment saves_count when favorite added
CREATE TRIGGER recipe_favorites_increment_saves
    AFTER INSERT ON public.recipe_favorites
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_recipe_saves();

-- Trigger to decrement saves_count when favorite removed
CREATE TRIGGER recipe_favorites_decrement_saves
    AFTER DELETE ON public.recipe_favorites
    FOR EACH ROW
    EXECUTE FUNCTION public.decrement_recipe_saves();
