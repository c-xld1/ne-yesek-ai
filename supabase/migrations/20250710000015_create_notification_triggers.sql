-- Create notification triggers for various events

-- Trigger for recipe likes
CREATE OR REPLACE FUNCTION public.notify_recipe_like()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if user is not liking their own recipe
    IF NEW.user_id != (SELECT author_id FROM public.recipes WHERE id = NEW.recipe_id) THEN
        PERFORM public.create_notification(
            (SELECT author_id FROM public.recipes WHERE id = NEW.recipe_id),
            'like',
            'Tarifin beğenildi!',
            (SELECT username FROM public.profiles WHERE id = NEW.user_id) || ' tarifini beğendi.',
            json_build_object('recipe_id', NEW.recipe_id, 'user_id', NEW.user_id),
            NEW.user_id,
            NEW.recipe_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_recipe_like_trigger
    AFTER INSERT ON public.likes
    FOR EACH ROW
    WHEN (NEW.recipe_id IS NOT NULL)
    EXECUTE FUNCTION public.notify_recipe_like();

-- Trigger for recipe comments
CREATE OR REPLACE FUNCTION public.notify_recipe_comment()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if user is not commenting on their own recipe
    IF NEW.author_id != (SELECT author_id FROM public.recipes WHERE id = NEW.recipe_id) THEN
        PERFORM public.create_notification(
            (SELECT author_id FROM public.recipes WHERE id = NEW.recipe_id),
            'comment',
            'Tarifine yorum yapıldı!',
            (SELECT username FROM public.profiles WHERE id = NEW.author_id) || ' tarifine yorum yaptı.',
            json_build_object('recipe_id', NEW.recipe_id, 'comment_id', NEW.id, 'user_id', NEW.author_id),
            NEW.author_id,
            NEW.recipe_id,
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_recipe_comment_trigger
    AFTER INSERT ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_recipe_comment();

-- Trigger for follows
CREATE OR REPLACE FUNCTION public.notify_follow()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_notification(
        NEW.following_id,
        'follow',
        'Yeni takipçin var!',
        (SELECT username FROM public.profiles WHERE id = NEW.follower_id) || ' seni takip etmeye başladı.',
        json_build_object('user_id', NEW.follower_id),
        NEW.follower_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_follow_trigger
    AFTER INSERT ON public.follows
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_follow();

-- Trigger for recipe ratings
CREATE OR REPLACE FUNCTION public.notify_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if user is not rating their own recipe
    IF NEW.user_id != (SELECT author_id FROM public.recipes WHERE id = NEW.recipe_id) THEN
        PERFORM public.create_notification(
            (SELECT author_id FROM public.recipes WHERE id = NEW.recipe_id),
            'rating',
            'Tarifin puanlandı!',
            (SELECT username FROM public.profiles WHERE id = NEW.user_id) || ' tarifini ' || NEW.rating || ' yıldızla puanladı.',
            json_build_object('recipe_id', NEW.recipe_id, 'rating', NEW.rating, 'user_id', NEW.user_id),
            NEW.user_id,
            NEW.recipe_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_recipe_rating_trigger
    AFTER INSERT ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_recipe_rating();

-- Trigger for recipe publishing
CREATE OR REPLACE FUNCTION public.notify_recipe_published()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify followers when recipe is published (not when updated)
    IF TG_OP = 'UPDATE' AND OLD.is_published = FALSE AND NEW.is_published = TRUE THEN
        -- Notify all followers
        INSERT INTO public.notifications (user_id, type, title, message, data, related_user_id, related_recipe_id)
        SELECT 
            f.follower_id,
            'recipe_published',
            'Takip ettiğin kişi yeni tarif paylaştı!',
            (SELECT username FROM public.profiles WHERE id = NEW.author_id) || ' yeni bir tarif paylaştı: ' || NEW.title,
            json_build_object('recipe_id', NEW.id, 'author_id', NEW.author_id),
            NEW.author_id,
            NEW.id
        FROM public.follows f
        WHERE f.following_id = NEW.author_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_recipe_published_trigger
    AFTER UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_recipe_published();

-- Create a function to update profile stats
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total recipes count
    UPDATE public.profiles 
    SET total_recipes = (
        SELECT COUNT(*) 
        FROM public.recipes 
        WHERE author_id = COALESCE(NEW.author_id, OLD.author_id) 
        AND is_published = true
    )
    WHERE id = COALESCE(NEW.author_id, OLD.author_id);
    
    -- Update total likes received
    UPDATE public.profiles 
    SET total_likes = (
        SELECT COALESCE(SUM(r.likes_count), 0)
        FROM public.recipes r
        WHERE r.author_id = COALESCE(NEW.author_id, OLD.author_id)
        AND r.is_published = true
    )
    WHERE id = COALESCE(NEW.author_id, OLD.author_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for profile stats
CREATE TRIGGER update_profile_stats_on_recipe_change
    AFTER INSERT OR UPDATE OR DELETE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profile_stats();

-- Create a function to clean up old notifications
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS VOID AS $$
BEGIN
    -- Delete notifications older than 30 days
    DELETE FROM public.notifications
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notifications_as_read(
    user_id_param UUID,
    notification_ids UUID[] DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    IF notification_ids IS NULL THEN
        -- Mark all notifications as read for the user
        UPDATE public.notifications
        SET is_read = true
        WHERE user_id = user_id_param AND is_read = false;
    ELSE
        -- Mark specific notifications as read
        UPDATE public.notifications
        SET is_read = true
        WHERE user_id = user_id_param AND id = ANY(notification_ids);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user's notification count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(
    user_id_param UUID
)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*)::INTEGER INTO count
    FROM public.notifications
    WHERE user_id = user_id_param AND is_read = false;
    
    RETURN count;
END;
$$ LANGUAGE plpgsql;
