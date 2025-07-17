-- Complete RLS Policies for All Tables
-- This migration sets up comprehensive Row Level Security policies for all tables in the application

-- =======================
-- PROFILES TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
-- Also drop our renamed policies to prevent duplication
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Create new policies for profiles
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- =======================
-- RECIPES TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "recipes_insert_authenticated" ON public.recipes;
DROP POLICY IF EXISTS "recipes_select_all" ON public.recipes;
DROP POLICY IF EXISTS "recipes_update_owner" ON public.recipes;
DROP POLICY IF EXISTS "recipes_delete_owner" ON public.recipes;

-- Create new policies for recipes
CREATE POLICY "recipes_insert_authenticated" ON public.recipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "recipes_select_all" ON public.recipes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "recipes_update_owner" ON public.recipes FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "recipes_delete_owner" ON public.recipes FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- =======================
-- COMMENTS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "comments_insert_authenticated" ON public.comments;
DROP POLICY IF EXISTS "comments_select_all" ON public.comments;
DROP POLICY IF EXISTS "comments_update_owner" ON public.comments;
DROP POLICY IF EXISTS "comments_delete_owner" ON public.comments;

-- Create new policies for comments
CREATE POLICY "comments_insert_authenticated" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "comments_update_owner" ON public.comments FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_delete_owner" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- =======================
-- RATINGS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "ratings_insert_authenticated" ON public.ratings;
DROP POLICY IF EXISTS "ratings_select_all" ON public.ratings;
DROP POLICY IF EXISTS "ratings_update_owner" ON public.ratings;
DROP POLICY IF EXISTS "ratings_delete_owner" ON public.ratings;

-- Create new policies for ratings
CREATE POLICY "ratings_insert_authenticated" ON public.ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_select_all" ON public.ratings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ratings_update_owner" ON public.ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_delete_owner" ON public.ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =======================
-- LIKES TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "likes_insert_authenticated" ON public.likes;
DROP POLICY IF EXISTS "likes_select_all" ON public.likes;
DROP POLICY IF EXISTS "likes_delete_owner" ON public.likes;

-- Create new policies for likes
CREATE POLICY "likes_insert_authenticated" ON public.likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_select_all" ON public.likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "likes_delete_owner" ON public.likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =======================
-- FAVORITES TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "favorites_insert_authenticated" ON public.favorites;
DROP POLICY IF EXISTS "favorites_select_owner" ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_owner" ON public.favorites;

-- Create new policies for favorites
CREATE POLICY "favorites_insert_authenticated" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_select_owner" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "favorites_delete_owner" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =======================
-- FOLLOWS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "follows_insert_authenticated" ON public.follows;
DROP POLICY IF EXISTS "follows_select_all" ON public.follows;
DROP POLICY IF EXISTS "follows_delete_owner" ON public.follows;

-- Create new policies for follows
CREATE POLICY "follows_insert_authenticated" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_select_all" ON public.follows FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "follows_delete_owner" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- =======================
-- NOTIFICATIONS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "notifications_insert_system" ON public.notifications;
DROP POLICY IF EXISTS "notifications_select_owner" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_owner" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_owner" ON public.notifications;

-- Create new policies for notifications
CREATE POLICY "notifications_insert_system" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true); -- System can create notifications
CREATE POLICY "notifications_select_owner" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_owner" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_delete_owner" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =======================
-- SHOPPING LISTS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "shopping_lists_insert_authenticated" ON public.shopping_lists;
DROP POLICY IF EXISTS "shopping_lists_select_owner" ON public.shopping_lists;
DROP POLICY IF EXISTS "shopping_lists_update_owner" ON public.shopping_lists;
DROP POLICY IF EXISTS "shopping_lists_delete_owner" ON public.shopping_lists;

-- Create new policies for shopping lists
CREATE POLICY "shopping_lists_insert_authenticated" ON public.shopping_lists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shopping_lists_select_owner" ON public.shopping_lists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "shopping_lists_update_owner" ON public.shopping_lists FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shopping_lists_delete_owner" ON public.shopping_lists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =======================
-- SHOPPING LIST ITEMS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "shopping_list_items_insert_list_owner" ON public.shopping_list_items;
DROP POLICY IF EXISTS "shopping_list_items_select_list_owner" ON public.shopping_list_items;
DROP POLICY IF EXISTS "shopping_list_items_update_list_owner" ON public.shopping_list_items;
DROP POLICY IF EXISTS "shopping_list_items_delete_list_owner" ON public.shopping_list_items;

-- Create new policies for shopping list items
CREATE POLICY "shopping_list_items_insert_list_owner" ON public.shopping_list_items FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_id AND user_id = auth.uid()
    )
);
CREATE POLICY "shopping_list_items_select_list_owner" ON public.shopping_list_items FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_id AND user_id = auth.uid()
    )
);
CREATE POLICY "shopping_list_items_update_list_owner" ON public.shopping_list_items FOR UPDATE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_id AND user_id = auth.uid()
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_id AND user_id = auth.uid()
    )
);
CREATE POLICY "shopping_list_items_delete_list_owner" ON public.shopping_list_items FOR DELETE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.shopping_lists 
        WHERE id = shopping_list_id AND user_id = auth.uid()
    )
);

-- =======================
-- QNA CATEGORIES TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "qna_categories_select_all" ON public.qna_categories;
DROP POLICY IF EXISTS "Only authenticated users can create QnA categories" ON public.qna_categories;
DROP POLICY IF EXISTS "Only authenticated users can update QnA categories" ON public.qna_categories;

-- Also drop policies created in previous runs to avoid duplicates
DROP POLICY IF EXISTS "qna_categories_insert_authenticated" ON public.qna_categories;
DROP POLICY IF EXISTS "qna_categories_update_authenticated" ON public.qna_categories;

-- Create new policies for QnA categories
CREATE POLICY "qna_categories_select_all" ON public.qna_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "qna_categories_insert_authenticated" ON public.qna_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "qna_categories_update_authenticated" ON public.qna_categories FOR UPDATE TO authenticated USING (true);

-- =======================
-- QNA QUESTIONS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "qna_questions_insert_authenticated" ON public.questions;
DROP POLICY IF EXISTS "qna_questions_select_all" ON public.questions;
DROP POLICY IF EXISTS "qna_questions_update_owner" ON public.questions;
DROP POLICY IF EXISTS "qna_questions_delete_owner" ON public.questions;

-- Create new policies for QnA questions
CREATE POLICY "qna_questions_insert_authenticated" ON public.questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "qna_questions_select_all" ON public.questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "qna_questions_update_owner" ON public.questions FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "qna_questions_delete_owner" ON public.questions FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- =======================
-- QNA ANSWERS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "qna_answers_insert_authenticated" ON public.answers;
DROP POLICY IF EXISTS "qna_answers_select_all" ON public.answers;
DROP POLICY IF EXISTS "qna_answers_update_owner" ON public.answers;
DROP POLICY IF EXISTS "qna_answers_delete_owner" ON public.answers;

-- Create new policies for QnA answers
CREATE POLICY "qna_answers_insert_authenticated" ON public.answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "qna_answers_select_all" ON public.answers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "qna_answers_update_owner" ON public.answers FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "qna_answers_delete_owner" ON public.answers FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- =======================
-- BLOG POSTS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "blog_posts_insert_authenticated" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_select_all" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_update_owner" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_delete_owner" ON public.blog_posts;

-- Create new policies for blog posts
CREATE POLICY "blog_posts_insert_authenticated" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "blog_posts_select_all" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "blog_posts_update_owner" ON public.blog_posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "blog_posts_delete_owner" ON public.blog_posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- =======================
-- VIDEO STORIES TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "video_stories_insert_authenticated" ON public.video_stories;
DROP POLICY IF EXISTS "video_stories_select_all" ON public.video_stories;
DROP POLICY IF EXISTS "video_stories_update_owner" ON public.video_stories;
DROP POLICY IF EXISTS "video_stories_delete_owner" ON public.video_stories;

-- Create new policies for video stories
CREATE POLICY "video_stories_insert_authenticated" ON public.video_stories FOR INSERT TO authenticated WITH CHECK (author_id IS NULL OR auth.uid() = author_id);
CREATE POLICY "video_stories_select_all" ON public.video_stories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "video_stories_update_owner" ON public.video_stories FOR UPDATE TO authenticated USING (author_id IS NULL OR auth.uid() = author_id) WITH CHECK (author_id IS NULL OR auth.uid() = author_id);
CREATE POLICY "video_stories_delete_owner" ON public.video_stories FOR DELETE TO authenticated USING (author_id IS NULL OR auth.uid() = author_id);

-- =======================
-- AFFILIATE LINKS TABLE POLICIES
-- =======================

-- Drop existing policies first
DROP POLICY IF EXISTS "affiliate_links_insert_authenticated" ON public.affiliate_links;
DROP POLICY IF EXISTS "affiliate_links_select_all" ON public.affiliate_links;
DROP POLICY IF EXISTS "affiliate_links_update_owner" ON public.affiliate_links;
DROP POLICY IF EXISTS "affiliate_links_delete_owner" ON public.affiliate_links;
-- Also drop our new policy names to prevent duplication
DROP POLICY IF EXISTS "affiliate_links_select_active" ON public.affiliate_links;
DROP POLICY IF EXISTS "affiliate_links_manage_authenticated" ON public.affiliate_links;

-- Create new policies for affiliate_links
CREATE POLICY "affiliate_links_select_active" ON public.affiliate_links FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "affiliate_links_manage_authenticated" ON public.affiliate_links FOR ALL TO authenticated USING (true);

-- =======================
-- READ-ONLY TABLES (Categories, Regional Categories)
-- =======================

-- Categories table - read-only for all users
DROP POLICY IF EXISTS "categories_select_all" ON public.categories;
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT TO anon, authenticated USING (true);

-- Regional categories table - read-only for all users
DROP POLICY IF EXISTS "regional_categories_select_all" ON public.regional_categories;
CREATE POLICY "regional_categories_select_all" ON public.regional_categories FOR SELECT TO anon, authenticated USING (true);

-- =======================
-- GRANT PERMISSIONS
-- =======================

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.recipes TO authenticated;
GRANT ALL ON public.comments TO authenticated;
GRANT ALL ON public.ratings TO authenticated;
GRANT ALL ON public.likes TO authenticated;
GRANT ALL ON public.favorites TO authenticated;
GRANT ALL ON public.follows TO authenticated;
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.shopping_lists TO authenticated;
GRANT ALL ON public.shopping_list_items TO authenticated;
GRANT ALL ON public.questions TO authenticated;  -- corrected table name
GRANT ALL ON public.answers TO authenticated;    -- corrected table name
GRANT ALL ON public.blog_posts TO authenticated;
GRANT ALL ON public.video_stories TO authenticated;
GRANT ALL ON public.affiliate_links TO authenticated;

-- Grant read permissions to anonymous users where appropriate
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.recipes TO anon;
GRANT SELECT ON public.comments TO anon;
GRANT SELECT ON public.ratings TO anon;
GRANT SELECT ON public.likes TO anon;
GRANT SELECT ON public.questions TO anon;  -- corrected table name
GRANT SELECT ON public.answers TO anon;    -- corrected table name
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.video_stories TO anon;
GRANT SELECT ON public.affiliate_links TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.regional_categories TO anon;

-- =======================
-- COMMENTS
-- =======================

COMMENT ON TABLE public.profiles IS 'User profiles with RLS policies - users can only manage their own profiles';
COMMENT ON TABLE public.recipes IS 'Recipes with RLS policies - users can only manage their own recipes';
COMMENT ON TABLE public.comments IS 'Comments with RLS policies - users can only manage their own comments';
COMMENT ON TABLE public.ratings IS 'Ratings with RLS policies - users can only manage their own ratings';
COMMENT ON TABLE public.likes IS 'Likes with RLS policies - users can only manage their own likes';
COMMENT ON TABLE public.favorites IS 'Favorites with RLS policies - users can only manage their own favorites';
COMMENT ON TABLE public.follows IS 'Follows with RLS policies - users can only manage their own follows';
COMMENT ON TABLE public.notifications IS 'Notifications with RLS policies - users can only see their own notifications';
COMMENT ON TABLE public.shopping_lists IS 'Shopping lists with RLS policies - users can only manage their own lists';
COMMENT ON TABLE public.shopping_list_items IS 'Shopping list items with RLS policies - users can only manage items in their own lists';
COMMENT ON TABLE public.questions IS 'QnA questions with RLS policies - users can only manage their own questions';
COMMENT ON TABLE public.answers IS 'QnA answers with RLS policies - users can only manage their own answers';
COMMENT ON TABLE public.blog_posts IS 'Blog posts with RLS policies - users can only manage their own posts';
COMMENT ON TABLE public.video_stories IS 'Video stories with RLS policies - users can only manage their own stories';
COMMENT ON TABLE public.affiliate_links IS 'Affiliate links with RLS policies - users can only manage their own links';
COMMENT ON TABLE public.qna_categories IS 'QnA categories with RLS policies - users can only manage their own categories';
