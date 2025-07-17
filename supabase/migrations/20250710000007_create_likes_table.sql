-- Create likes table (for recipes, comments, etc.)
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (
        (recipe_id IS NOT NULL AND comment_id IS NULL) OR
        (recipe_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE(user_id, recipe_id),
    UNIQUE(user_id, comment_id)
);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert likes" 
ON public.likes FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.likes FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update likes count
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.recipe_id IS NOT NULL THEN
            UPDATE public.recipes 
            SET likes_count = likes_count + 1
            WHERE id = NEW.recipe_id;
        ELSIF NEW.comment_id IS NOT NULL THEN
            UPDATE public.comments 
            SET likes_count = likes_count + 1
            WHERE id = NEW.comment_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.recipe_id IS NOT NULL THEN
            UPDATE public.recipes 
            SET likes_count = GREATEST(0, likes_count - 1)
            WHERE id = OLD.recipe_id;
        ELSIF OLD.comment_id IS NOT NULL THEN
            UPDATE public.comments 
            SET likes_count = GREATEST(0, likes_count - 1)
            WHERE id = OLD.comment_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for likes count
CREATE TRIGGER likes_update_count_insert
    AFTER INSERT ON public.likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_likes_count();

CREATE TRIGGER likes_update_count_delete
    AFTER DELETE ON public.likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_likes_count();

-- Create indexes
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS likes_recipe_id_idx ON public.likes(recipe_id);
CREATE INDEX IF NOT EXISTS likes_comment_id_idx ON public.likes(comment_id);
CREATE INDEX IF NOT EXISTS likes_created_at_idx ON public.likes(created_at DESC);
