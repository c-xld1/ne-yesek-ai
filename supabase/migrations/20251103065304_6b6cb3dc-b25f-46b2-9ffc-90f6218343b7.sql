-- Fix function search path for security
ALTER FUNCTION public.has_role(_user_id uuid, _role app_role) SET search_path = public;
ALTER FUNCTION public.increment_story_views(story_id uuid) SET search_path = public;
ALTER FUNCTION public.increment_story_likes(story_id uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;