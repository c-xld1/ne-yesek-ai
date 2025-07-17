-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'recipe_published', 'rating', 'system')),
    title TEXT NOT NULL,
    message TEXT,
    data JSONB,
    related_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    related_recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    related_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT DEFAULT NULL,
    p_data JSONB DEFAULT NULL,
    p_related_user_id UUID DEFAULT NULL,
    p_related_recipe_id UUID DEFAULT NULL,
    p_related_comment_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id, type, title, message, data,
        related_user_id, related_recipe_id, related_comment_id
    )
    VALUES (
        p_user_id, p_type, p_title, p_message, p_data,
        p_related_user_id, p_related_recipe_id, p_related_comment_id
    )
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON public.notifications(type);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_related_user_id_idx ON public.notifications(related_user_id);
CREATE INDEX IF NOT EXISTS notifications_related_recipe_id_idx ON public.notifications(related_recipe_id);
CREATE INDEX IF NOT EXISTS notifications_related_comment_id_idx ON public.notifications(related_comment_id);
