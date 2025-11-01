import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVideoStories = () => {
  return useQuery({
    queryKey: ['video-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_stories')
        .select(`
          *,
          profile:profiles(username, fullname, avatar_url),
          recipe:recipes(title, image_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching video stories:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useFeaturedVideoStories = () => {
  return useQuery({
    queryKey: ['video-stories', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_stories')
        .select(`
          *,
          profile:profiles(username, fullname, avatar_url),
          recipe:recipes(title, image_url)
        `)
        .eq('is_featured', true)
        .order('views', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching featured video stories:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useIncrementStoryViews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: string) => {
      const { error } = await supabase.rpc('increment_story_views', {
        story_id: storyId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-stories'] });
    },
  });
};

export const useIncrementStoryLikes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: string) => {
      const { error } = await supabase.rpc('increment_story_likes', {
        story_id: storyId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-stories'] });
    },
  });
};
