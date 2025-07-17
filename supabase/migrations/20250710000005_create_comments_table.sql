-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Comments are viewable by everyone if approved" 
ON public.comments FOR SELECT 
USING (is_approved = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can insert comments" 
ON public.comments FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = author_id);

-- Create trigger for updated_at
CREATE TRIGGER comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update recipe comments count
CREATE OR REPLACE FUNCTION public.update_recipe_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.recipes 
        SET comments_count = comments_count + 1
        WHERE id = NEW.recipe_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.recipes 
        SET comments_count = GREATEST(0, comments_count - 1)
        WHERE id = OLD.recipe_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for comments count
CREATE TRIGGER comments_update_recipe_count_insert
    AFTER INSERT ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_recipe_comments_count();

CREATE TRIGGER comments_update_recipe_count_delete
    AFTER DELETE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_recipe_comments_count();

-- Create function to update parent comment replies count
CREATE OR REPLACE FUNCTION public.update_parent_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
        UPDATE public.comments 
        SET replies_count = replies_count + 1
        WHERE id = NEW.parent_comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
        UPDATE public.comments 
        SET replies_count = GREATEST(0, replies_count - 1)
        WHERE id = OLD.parent_comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for replies count
CREATE TRIGGER comments_update_parent_replies_count_insert
    AFTER INSERT ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_parent_comment_replies_count();

CREATE TRIGGER comments_update_parent_replies_count_delete
    AFTER DELETE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_parent_comment_replies_count();

-- Create indexes
CREATE INDEX IF NOT EXISTS comments_author_id_idx ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS comments_recipe_id_idx ON public.comments(recipe_id);
CREATE INDEX IF NOT EXISTS comments_parent_comment_id_idx ON public.comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS comments_is_approved_idx ON public.comments(is_approved);
CREATE INDEX IF NOT EXISTS comments_is_flagged_idx ON public.comments(is_flagged);
