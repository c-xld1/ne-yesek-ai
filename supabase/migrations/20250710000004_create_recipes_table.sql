-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    ingredients JSONB NOT NULL,
    instructions JSONB NOT NULL,
    image_url TEXT,
    video_url TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    regional_category_id UUID REFERENCES public.regional_categories(id) ON DELETE SET NULL,
    prep_time INTEGER, -- minutes
    cooking_time INTEGER, -- minutes
    total_time INTEGER, -- minutes
    servings INTEGER,
    difficulty TEXT CHECK (difficulty IN ('kolay', 'orta', 'zor')),
    cuisine_type TEXT,
    tags TEXT[] DEFAULT '{}',
    nutritional_info JSONB,
    calories_per_serving INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    rating DECIMAL(2,1) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Published recipes are viewable by everyone" 
ON public.recipes FOR SELECT 
USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Users can insert their own recipes" 
ON public.recipes FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own recipes" 
ON public.recipes FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own recipes" 
ON public.recipes FOR DELETE 
USING (auth.uid() = author_id);

-- Create trigger for updated_at
CREATE TRIGGER recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to calculate total_time
CREATE OR REPLACE FUNCTION public.calculate_total_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_time = COALESCE(NEW.prep_time, 0) + COALESCE(NEW.cooking_time, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for total_time calculation
CREATE TRIGGER recipes_calculate_total_time
    BEFORE INSERT OR UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_total_time();

-- Create indexes
CREATE INDEX IF NOT EXISTS recipes_author_id_idx ON public.recipes(author_id);
CREATE INDEX IF NOT EXISTS recipes_category_id_idx ON public.recipes(category_id);
CREATE INDEX IF NOT EXISTS recipes_regional_category_id_idx ON public.recipes(regional_category_id);
CREATE INDEX IF NOT EXISTS recipes_slug_idx ON public.recipes(slug);
CREATE INDEX IF NOT EXISTS recipes_is_published_idx ON public.recipes(is_published);
CREATE INDEX IF NOT EXISTS recipes_is_featured_idx ON public.recipes(is_featured);
CREATE INDEX IF NOT EXISTS recipes_published_at_idx ON public.recipes(published_at DESC);
CREATE INDEX IF NOT EXISTS recipes_rating_idx ON public.recipes(rating DESC);
CREATE INDEX IF NOT EXISTS recipes_views_idx ON public.recipes(views DESC);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON public.recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS recipes_tags_idx ON public.recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS recipes_difficulty_idx ON public.recipes(difficulty);
CREATE INDEX IF NOT EXISTS recipes_cuisine_type_idx ON public.recipes(cuisine_type);

-- IMMUTABLE wrapper for to_tsvector
CREATE OR REPLACE FUNCTION public.immutable_tsvector(text, text, text[])
RETURNS tsvector AS $$
    SELECT to_tsvector('turkish', $1 || ' ' || COALESCE($2, '') || ' ' || array_to_string($3, ' '));
$$ LANGUAGE sql IMMUTABLE;

-- Create full-text search index
CREATE INDEX IF NOT EXISTS recipes_search_idx ON public.recipes 
USING GIN(public.immutable_tsvector(title, description, tags));
