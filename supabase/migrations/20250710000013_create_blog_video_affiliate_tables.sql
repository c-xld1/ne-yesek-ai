-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create video_stories table
CREATE TABLE IF NOT EXISTS public.video_stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    duration INTEGER, -- seconds
    quality TEXT DEFAULT 'HD',
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create affiliate_links table
CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    commission_rate DECIMAL(5,2),
    commission_type TEXT DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed')),
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts FOR SELECT 
USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create blog posts" 
ON public.blog_posts FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blog posts" 
ON public.blog_posts FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blog posts" 
ON public.blog_posts FOR DELETE 
USING (auth.uid() = author_id);

-- Create policies for video_stories
CREATE POLICY "Published video stories are viewable by everyone" 
ON public.video_stories FOR SELECT 
USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create video stories" 
ON public.video_stories FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own video stories" 
ON public.video_stories FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own video stories" 
ON public.video_stories FOR DELETE 
USING (auth.uid() = author_id);

-- Create policies for affiliate_links
CREATE POLICY "Active affiliate links are viewable by everyone" 
ON public.affiliate_links FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage affiliate links" 
ON public.affiliate_links FOR ALL 
TO authenticated
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER video_stories_updated_at
    BEFORE UPDATE ON public.video_stories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER affiliate_links_updated_at
    BEFORE UPDATE ON public.affiliate_links
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS blog_posts_category_id_idx ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS blog_posts_is_featured_idx ON public.blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON public.blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON public.blog_posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS video_stories_author_id_idx ON public.video_stories(author_id);
CREATE INDEX IF NOT EXISTS video_stories_recipe_id_idx ON public.video_stories(recipe_id);
CREATE INDEX IF NOT EXISTS video_stories_is_published_idx ON public.video_stories(is_published);
CREATE INDEX IF NOT EXISTS video_stories_is_featured_idx ON public.video_stories(is_featured);
CREATE INDEX IF NOT EXISTS video_stories_published_at_idx ON public.video_stories(published_at DESC);
CREATE INDEX IF NOT EXISTS video_stories_views_idx ON public.video_stories(views DESC);
CREATE INDEX IF NOT EXISTS video_stories_tags_idx ON public.video_stories USING GIN(tags);

CREATE INDEX IF NOT EXISTS affiliate_links_category_idx ON public.affiliate_links(category);
CREATE INDEX IF NOT EXISTS affiliate_links_is_active_idx ON public.affiliate_links(is_active);
CREATE INDEX IF NOT EXISTS affiliate_links_click_count_idx ON public.affiliate_links(click_count DESC);
CREATE INDEX IF NOT EXISTS affiliate_links_conversion_count_idx ON public.affiliate_links(conversion_count DESC);
