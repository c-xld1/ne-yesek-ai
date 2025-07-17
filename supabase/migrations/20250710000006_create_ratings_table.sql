-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Ratings are viewable by everyone" 
ON public.ratings FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert ratings" 
ON public.ratings FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.ratings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.ratings FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER ratings_updated_at
    BEFORE UPDATE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update recipe rating
CREATE OR REPLACE FUNCTION public.update_recipe_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(2,1);
    rating_count INTEGER;
BEGIN
    -- Calculate new average rating and count
    SELECT 
        ROUND(AVG(rating), 1),
        COUNT(*)
    INTO avg_rating, rating_count
    FROM public.ratings 
    WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id);
    
    -- Update recipe with new rating
    UPDATE public.recipes 
    SET 
        rating = COALESCE(avg_rating, 0),
        rating_count = rating_count
    WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for rating updates
CREATE TRIGGER ratings_update_recipe_rating_insert
    AFTER INSERT ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_recipe_rating();

CREATE TRIGGER ratings_update_recipe_rating_update
    AFTER UPDATE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_recipe_rating();

CREATE TRIGGER ratings_update_recipe_rating_delete
    AFTER DELETE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_recipe_rating();

-- Create indexes
CREATE INDEX IF NOT EXISTS ratings_user_id_idx ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS ratings_recipe_id_idx ON public.ratings(recipe_id);
CREATE INDEX IF NOT EXISTS ratings_rating_idx ON public.ratings(rating);
CREATE INDEX IF NOT EXISTS ratings_created_at_idx ON public.ratings(created_at DESC);
