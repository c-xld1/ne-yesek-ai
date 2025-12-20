-- Fix achievement functions to use author_id instead of user_id

-- Fix main check function
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_recipe_count INTEGER;
    v_follower_count INTEGER;
    v_total_likes INTEGER;
    v_total_views INTEGER;
    v_achievement RECORD;
BEGIN
    SELECT COUNT(*) INTO v_recipe_count
    FROM recipes WHERE author_id = p_user_id AND is_draft = false;
    
    SELECT COUNT(*) INTO v_follower_count
    FROM follows WHERE following_id = p_user_id;
    
    SELECT COALESCE(SUM(likes_count), 0) INTO v_total_likes
    FROM recipes WHERE author_id = p_user_id;
    
    SELECT COALESCE(SUM(views), 0) INTO v_total_views
    FROM recipes WHERE author_id = p_user_id;
    
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix recipe insert trigger
CREATE OR REPLACE FUNCTION check_achievements_on_recipe_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_draft = false THEN
        PERFORM check_and_award_achievements(NEW.author_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
