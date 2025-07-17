-- Create views for analytics and data aggregation

-- Popular recipes view (weekly)
CREATE OR REPLACE VIEW public.popular_recipes_weekly AS
SELECT 
    r.id,
    r.title,
    r.slug,
    r.image_url,
    r.author_id,
    p.username as author_username,
    r.category_id,
    r.rating,
    r.views,
    r.likes_count,
    r.published_at
FROM public.recipes r
JOIN public.profiles p ON r.author_id = p.id
WHERE r.is_published = true
    AND r.published_at >= NOW() - INTERVAL '7 days'
ORDER BY r.views DESC, r.likes_count DESC
LIMIT 50;

-- Recipe analytics view
CREATE OR REPLACE VIEW public.recipe_analytics AS
SELECT 
    r.id,
    r.title,
    r.slug,
    r.author_id,
    r.category_id,
    r.regional_category_id,
    r.difficulty,
    r.cuisine_type,
    r.rating,
    r.rating_count,
    r.views,
    r.likes_count,
    r.comments_count,
    r.saves_count,
    r.shares_count,
    r.published_at,
    CASE 
        WHEN r.published_at >= NOW() - INTERVAL '1 day' THEN 'today'
        WHEN r.published_at >= NOW() - INTERVAL '7 days' THEN 'this_week'
        WHEN r.published_at >= NOW() - INTERVAL '30 days' THEN 'this_month'
        ELSE 'older'
    END as recency,
    (r.views * 0.3 + r.likes_count * 0.4 + r.rating * r.rating_count * 0.3) as popularity_score
FROM public.recipes r
WHERE r.is_published = true;

-- User activity summary view
CREATE OR REPLACE VIEW public.user_activity_summary AS
SELECT 
    p.id,
    p.username,
    p.fullname,
    p.avatar_url,
    p.followers_count,
    p.following_count,
    p.total_recipes,
    p.total_likes,
    COUNT(DISTINCT r.id) as published_recipes_count,
    COUNT(DISTINCT c.id) as comments_count,
    COUNT(DISTINCT rt.id) as ratings_given,
    SUM(r.views) as total_recipe_views,
    SUM(r.likes_count) as total_recipe_likes_received,
    AVG(r.rating) as average_recipe_rating
FROM public.profiles p
LEFT JOIN public.recipes r ON p.id = r.author_id AND r.is_published = true
LEFT JOIN public.comments c ON p.id = c.author_id
LEFT JOIN public.ratings rt ON p.id = rt.user_id
GROUP BY p.id, p.username, p.fullname, p.avatar_url, p.followers_count, p.following_count, p.total_recipes, p.total_likes;

-- Create functions for advanced operations

-- Function to get popular recipes with filters
CREATE OR REPLACE FUNCTION public.get_popular_recipes(
    category_filter TEXT DEFAULT NULL,
    difficulty_filter TEXT DEFAULT NULL,
    max_cooking_time INTEGER DEFAULT NULL,
    min_rating DECIMAL DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    image_url TEXT,
    author_username TEXT,
    rating DECIMAL,
    views INTEGER,
    likes_count INTEGER,
    published_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ra.id,
        ra.title,
        ra.slug,
        r.image_url,
        p.username as author_username,
        ra.rating,
        ra.views,
        ra.likes_count,
        ra.published_at
    FROM public.recipe_analytics ra
    JOIN public.recipes r ON ra.id = r.id
    JOIN public.profiles p ON ra.author_id = p.id
    LEFT JOIN public.categories c ON ra.category_id = c.id
    WHERE (category_filter IS NULL OR c.slug = category_filter)
        AND (difficulty_filter IS NULL OR ra.difficulty = difficulty_filter)
        AND (max_cooking_time IS NULL OR r.cooking_time <= max_cooking_time)
        AND (min_rating IS NULL OR ra.rating >= min_rating)
    ORDER BY ra.popularity_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get recipe recommendations based on user activity
CREATE OR REPLACE FUNCTION public.get_recipe_recommendations(
    user_id_param UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    image_url TEXT,
    author_username TEXT,
    rating DECIMAL,
    views INTEGER,
    likes_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.title,
        r.slug,
        r.image_url,
        p.username as author_username,
        r.rating,
        r.views,
        r.likes_count
    FROM public.recipes r
    JOIN public.profiles p ON r.author_id = p.id
    WHERE r.is_published = true
        AND r.author_id != user_id_param
        AND r.id NOT IN (
            SELECT recipe_id FROM public.favorites WHERE user_id = user_id_param
        )
        AND (
            r.category_id IN (
                SELECT DISTINCT r2.category_id 
                FROM public.recipes r2
                JOIN public.favorites f ON r2.id = f.recipe_id
                WHERE f.user_id = user_id_param
            )
            OR r.regional_category_id IN (
                SELECT DISTINCT r2.regional_category_id 
                FROM public.recipes r2
                JOIN public.favorites f ON r2.id = f.recipe_id
                WHERE f.user_id = user_id_param
            )
        )
    ORDER BY r.rating DESC, r.views DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get recipe statistics
CREATE OR REPLACE FUNCTION public.get_recipe_stats(
    recipe_id_param UUID
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_views', r.views,
        'total_likes', r.likes_count,
        'total_comments', r.comments_count,
        'total_saves', r.saves_count,
        'total_shares', r.shares_count,
        'average_rating', r.rating,
        'rating_count', r.rating_count,
        'rating_distribution', (
            SELECT json_object_agg(rating, count)
            FROM (
                SELECT rating, COUNT(*) as count
                FROM public.ratings
                WHERE recipe_id = recipe_id_param
                GROUP BY rating
                ORDER BY rating
            ) rating_dist
        )
    ) INTO result
    FROM public.recipes r
    WHERE r.id = recipe_id_param;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending tags
CREATE OR REPLACE FUNCTION public.get_trending_tags(
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (tag TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        unnest(tags) as tag,
        COUNT(*) as count
    FROM public.recipes
    WHERE is_published = true
        AND published_at >= NOW() - INTERVAL '30 days'
    GROUP BY unnest(tags)
    ORDER BY count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity feed
CREATE OR REPLACE FUNCTION public.get_user_activity_feed(
    user_id_param UUID,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    activity_type TEXT,
    activity_data JSON,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    (
        -- Recent recipes from followed users
        SELECT 
            'recipe_published' as activity_type,
            json_build_object(
                'recipe_id', r.id,
                'recipe_title', r.title,
                'recipe_slug', r.slug,
                'recipe_image', r.image_url,
                'author_id', r.author_id,
                'author_username', p.username
            ) as activity_data,
            r.published_at as created_at
        FROM public.recipes r
        JOIN public.profiles p ON r.author_id = p.id
        JOIN public.follows f ON r.author_id = f.following_id
        WHERE f.follower_id = user_id_param
            AND r.is_published = true
            AND r.published_at >= NOW() - INTERVAL '7 days'
    )
    UNION ALL
    (
        -- Recent likes on user's recipes
        SELECT 
            'recipe_liked' as activity_type,
            json_build_object(
                'recipe_id', r.id,
                'recipe_title', r.title,
                'recipe_slug', r.slug,
                'liker_id', l.user_id,
                'liker_username', p.username
            ) as activity_data,
            l.created_at
        FROM public.likes l
        JOIN public.recipes r ON l.recipe_id = r.id
        JOIN public.profiles p ON l.user_id = p.id
        WHERE r.author_id = user_id_param
            AND l.created_at >= NOW() - INTERVAL '7 days'
    )
    ORDER BY created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to increment recipe views (for analytics)
CREATE OR REPLACE FUNCTION public.increment_recipe_views(
    recipe_id_param UUID
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.recipes 
    SET views = views + 1
    WHERE id = recipe_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refresh recipe search index
CREATE OR REPLACE FUNCTION public.refresh_recipe_search_index()
RETURNS VOID AS $$
BEGIN
    REINDEX INDEX public.recipes_search_idx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for full-text search on recipes
CREATE OR REPLACE FUNCTION public.search_recipes(
    search_query TEXT,
    category_filter TEXT DEFAULT NULL,
    difficulty_filter TEXT DEFAULT NULL,
    max_cooking_time INTEGER DEFAULT NULL,
    min_rating DECIMAL DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    description TEXT,
    image_url TEXT,
    author_username TEXT,
    category_name TEXT,
    rating DECIMAL,
    views INTEGER,
    likes_count INTEGER,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.title,
        r.slug,
        r.description,
        r.image_url,
        p.username as author_username,
        c.name as category_name,
        r.rating,
        r.views,
        r.likes_count,
        ts_rank(to_tsvector('turkish', r.title || ' ' || COALESCE(r.description, '') || ' ' || array_to_string(r.tags, ' ')), plainto_tsquery('turkish', search_query)) as rank
    FROM public.recipes r
    JOIN public.profiles p ON r.author_id = p.id
    LEFT JOIN public.categories c ON r.category_id = c.id
    WHERE r.is_published = true
        AND to_tsvector('turkish', r.title || ' ' || COALESCE(r.description, '') || ' ' || array_to_string(r.tags, ' ')) @@ plainto_tsquery('turkish', search_query)
        AND (category_filter IS NULL OR c.slug = category_filter)
        AND (difficulty_filter IS NULL OR r.difficulty = difficulty_filter)
        AND (max_cooking_time IS NULL OR r.cooking_time <= max_cooking_time)
        AND (min_rating IS NULL OR r.rating >= min_rating)
    ORDER BY rank DESC, r.views DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
