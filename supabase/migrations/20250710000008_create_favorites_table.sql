-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own favorites" 
ON public.favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
ON public.favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.favorites FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update recipe saves count
CREATE OR REPLACE FUNCTION public.update_recipe_saves_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.recipes 
        SET saves_count = saves_count + 1
        WHERE id = NEW.recipe_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.recipes 
        SET saves_count = GREATEST(0, saves_count - 1)
        WHERE id = OLD.recipe_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for saves count
CREATE TRIGGER favorites_update_saves_count_insert
    AFTER INSERT ON public.favorites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_recipe_saves_count();

CREATE TRIGGER favorites_update_saves_count_delete
    AFTER DELETE ON public.favorites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_recipe_saves_count();

-- Create indexes
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_recipe_id_idx ON public.favorites(recipe_id);
CREATE INDEX IF NOT EXISTS favorites_created_at_idx ON public.favorites(created_at DESC);
