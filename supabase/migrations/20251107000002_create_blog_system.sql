-- Create blog_posts table for blog articles
-- This table stores all blog posts with categories, authors, and engagement metrics

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 5, -- in minutes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Create blog_likes table for tracking user likes on blog posts
CREATE TABLE IF NOT EXISTS public.blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Create blog_comments table for blog post comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_likes_user ON public.blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post ON public.blog_likes(post_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user ON public.blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent ON public.blog_comments(parent_id);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Anyone can view published blog posts'
    ) THEN
        CREATE POLICY "Anyone can view published blog posts"
            ON public.blog_posts
            FOR SELECT
            USING (published = true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Authors can view own drafts'
    ) THEN
        CREATE POLICY "Authors can view own drafts"
            ON public.blog_posts
            FOR SELECT
            USING (auth.uid() = author_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Authors can create own posts'
    ) THEN
        CREATE POLICY "Authors can create own posts"
            ON public.blog_posts
            FOR INSERT
            WITH CHECK (auth.uid() = author_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Authors can update own posts'
    ) THEN
        CREATE POLICY "Authors can update own posts"
            ON public.blog_posts
            FOR UPDATE
            USING (auth.uid() = author_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Authors can delete own posts'
    ) THEN
        CREATE POLICY "Authors can delete own posts"
            ON public.blog_posts
            FOR DELETE
            USING (auth.uid() = author_id);
    END IF;
END $$;

-- RLS Policies for blog_likes
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_likes' 
        AND policyname = 'Anyone can view blog likes'
    ) THEN
        CREATE POLICY "Anyone can view blog likes"
            ON public.blog_likes
            FOR SELECT
            USING (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_likes' 
        AND policyname = 'Users can like blog posts'
    ) THEN
        CREATE POLICY "Users can like blog posts"
            ON public.blog_likes
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_likes' 
        AND policyname = 'Users can unlike blog posts'
    ) THEN
        CREATE POLICY "Users can unlike blog posts"
            ON public.blog_likes
            FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- RLS Policies for blog_comments
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_comments' 
        AND policyname = 'Anyone can view blog comments'
    ) THEN
        CREATE POLICY "Anyone can view blog comments"
            ON public.blog_comments
            FOR SELECT
            USING (true);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_comments' 
        AND policyname = 'Authenticated users can create comments'
    ) THEN
        CREATE POLICY "Authenticated users can create comments"
            ON public.blog_comments
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_comments' 
        AND policyname = 'Users can update own comments'
    ) THEN
        CREATE POLICY "Users can update own comments"
            ON public.blog_comments
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_comments' 
        AND policyname = 'Users can delete own comments'
    ) THEN
        CREATE POLICY "Users can delete own comments"
            ON public.blog_comments
            FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Trigger to increment like_count on blog_posts
CREATE OR REPLACE FUNCTION increment_blog_like_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.blog_posts
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_blog_like_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.blog_posts
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_like_increment ON public.blog_likes;
CREATE TRIGGER blog_like_increment
    AFTER INSERT ON public.blog_likes
    FOR EACH ROW
    EXECUTE FUNCTION increment_blog_like_count();

DROP TRIGGER IF EXISTS blog_like_decrement ON public.blog_likes;
CREATE TRIGGER blog_like_decrement
    AFTER DELETE ON public.blog_likes
    FOR EACH ROW
    EXECUTE FUNCTION decrement_blog_like_count();

-- Trigger to increment comment_count on blog_posts
CREATE OR REPLACE FUNCTION increment_blog_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.blog_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_blog_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.blog_posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_comment_increment ON public.blog_comments;
CREATE TRIGGER blog_comment_increment
    AFTER INSERT ON public.blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION increment_blog_comment_count();

DROP TRIGGER IF EXISTS blog_comment_decrement ON public.blog_comments;
CREATE TRIGGER blog_comment_decrement
    AFTER DELETE ON public.blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION decrement_blog_comment_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_updated_at();

DROP TRIGGER IF EXISTS blog_comments_updated_at ON public.blog_comments;
CREATE TRIGGER blog_comments_updated_at
    BEFORE UPDATE ON public.blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_updated_at();

-- Add comments
COMMENT ON TABLE public.blog_posts IS 'Blog posts and articles';
COMMENT ON TABLE public.blog_likes IS 'User likes on blog posts';
COMMENT ON TABLE public.blog_comments IS 'Comments on blog posts';
COMMENT ON COLUMN public.blog_posts.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN public.blog_posts.featured IS 'Whether post is featured on homepage';
COMMENT ON COLUMN public.blog_posts.read_time IS 'Estimated reading time in minutes';
