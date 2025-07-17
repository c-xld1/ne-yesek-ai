-- Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view follows" 
ON public.follows FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.follows FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON public.follows FOR DELETE 
USING (auth.uid() = follower_id);

-- Create function to update followers/following counts
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update follower's following count
        UPDATE public.profiles 
        SET following_count = following_count + 1
        WHERE id = NEW.follower_id;
        
        -- Update following's followers count
        UPDATE public.profiles 
        SET followers_count = followers_count + 1
        WHERE id = NEW.following_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update follower's following count
        UPDATE public.profiles 
        SET following_count = GREATEST(0, following_count - 1)
        WHERE id = OLD.follower_id;
        
        -- Update following's followers count
        UPDATE public.profiles 
        SET followers_count = GREATEST(0, followers_count - 1)
        WHERE id = OLD.following_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for follow counts
CREATE TRIGGER follows_update_counts_insert
    AFTER INSERT ON public.follows
    FOR EACH ROW
    EXECUTE FUNCTION public.update_follow_counts();

CREATE TRIGGER follows_update_counts_delete
    AFTER DELETE ON public.follows
    FOR EACH ROW
    EXECUTE FUNCTION public.update_follow_counts();

-- Create indexes
CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_id_idx ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS follows_created_at_idx ON public.follows(created_at DESC);
