-- Fix 1: Enable RLS on stores table
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Add policies for stores table
CREATE POLICY "Public can view stores"
  ON stores FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert stores"
  ON stores FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update stores"
  ON stores FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete stores"
  ON stores FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Restrict courier data access - replace permissive policy
DROP POLICY IF EXISTS "Couriers viewable by everyone" ON couriers;

-- Only authenticated users can view couriers
CREATE POLICY "Authenticated users can view couriers"
  ON couriers FOR SELECT
  TO authenticated
  USING (true);

-- Fix 3: Fix functions with mutable search_path
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    v_recipe_count INTEGER;
    v_follower_count INTEGER;
    v_total_likes INTEGER;
    v_total_views INTEGER;
    v_achievement RECORD;
BEGIN
    SELECT COUNT(*) INTO v_recipe_count
    FROM recipes WHERE user_id = p_user_id AND is_draft = false;
    
    SELECT COUNT(*) INTO v_follower_count
    FROM user_follows WHERE followed_id = p_user_id;
    
    SELECT COALESCE(SUM(likes_count), 0) INTO v_total_likes
    FROM recipes WHERE user_id = p_user_id;
    
    SELECT COALESCE(SUM(views), 0) INTO v_total_views
    FROM recipes WHERE user_id = p_user_id;
    
    FOR v_achievement IN 
        SELECT * FROM achievement_definitions WHERE is_active = true
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM user_achievements 
            WHERE user_id = p_user_id AND achievement_key = v_achievement.key
        ) THEN
            IF (v_achievement.requirement_type = 'recipe_count' AND v_recipe_count >= v_achievement.requirement_value)
            OR (v_achievement.requirement_type = 'follower_count' AND v_follower_count >= v_achievement.requirement_value)
            OR (v_achievement.requirement_type = 'total_likes' AND v_total_likes >= v_achievement.requirement_value)
            OR (v_achievement.requirement_type = 'total_views' AND v_total_views >= v_achievement.requirement_value)
            THEN
                INSERT INTO user_achievements (user_id, achievement_key)
                VALUES (p_user_id, v_achievement.key);
            END IF;
        END IF;
    END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_achievements_on_recipe_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    IF NEW.is_draft = false THEN
        PERFORM check_and_award_achievements(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_achievements_on_like()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
    v_recipe_owner_id UUID;
BEGIN
    SELECT user_id INTO v_recipe_owner_id
    FROM recipes WHERE id = NEW.recipe_id;
    
    IF v_recipe_owner_id IS NOT NULL THEN
        PERFORM check_and_award_achievements(v_recipe_owner_id);
    END IF;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_achievements_on_view_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    IF NEW.views != OLD.views THEN
        PERFORM check_and_award_achievements(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_blog_like_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE blog_posts
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_blog_like_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE blog_posts
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_blog_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE blog_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_blog_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE blog_posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_seo_settings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_recipe_saves()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE recipes
    SET saves_count = saves_count + 1
    WHERE id = NEW.recipe_id;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_recipe_saves()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE recipes
    SET saves_count = GREATEST(0, saves_count - 1)
    WHERE id = OLD.recipe_id;
    RETURN OLD;
END;
$function$;