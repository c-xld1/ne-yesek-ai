import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
    author_name?: string;
    rating?: number;
    category_name?: string;
    user_id?: string;
};

export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data: recipes, error } = await supabase
        .from('recipes')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      // Fetch profiles separately to avoid relation issues
      const userIds = [...new Set((recipes || []).map((r: any) => r.user_id).filter(Boolean))];
      // @ts-ignore - profiles table has dynamic columns
      const { data: profiles } = userIds.length > 0 
        ? await supabase.from('profiles').select('id, username, fullname, avatar_url').in('id', userIds)
        : { data: [] };

      return (recipes || []).map((recipe: any) => {
        const profile = (profiles || []).find((p: any) => p.id === recipe.user_id);
        return {
          ...recipe,
          author_name: profile?.fullname || profile?.username || 'Anonim',
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          category_name: recipe.category?.name || 'Genel',
          view_count: recipe.view_count || 0,
          like_count: recipe.like_count || 0,
          comment_count: recipe.comment_count || 0,
        };
      });
    },
  });
};

export const useFeaturedRecipes = () => {
  return useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('is_featured', true)
        .eq('is_draft', false)
        .order('views', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching featured recipes:', error);
        throw error;
      }

      // Fetch profiles separately
      const userIds = [...new Set((data || []).map((r: any) => r.user_id).filter(Boolean))];
      // @ts-ignore - profiles table has dynamic columns
      const { data: profiles } = userIds.length > 0
        ? await supabase.from('profiles').select('id, username, fullname, avatar_url').in('id', userIds)
        : { data: [] };

      return (data || []).map((recipe: any) => {
        const profile = (profiles || []).find((p: any) => p.id === recipe.user_id);
        return {
          ...recipe,
          author_name: profile?.fullname || profile?.username || 'Anonim',
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          category_name: recipe.category?.name || 'Genel',
          view_count: recipe.view_count || 0,
          like_count: recipe.like_count || 0,
          comment_count: recipe.comment_count || 0,
        };
      });
    },
  });
};

export const useSearchRecipes = (searchTerm: string) => {
  return useQuery({
    queryKey: ['recipes', 'search', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('is_draft', false)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);

      if (error) {
        console.error('Error searching recipes:', error);
        throw error;
      }

      // Fetch profiles separately
      const userIds = [...new Set((data || []).map((r: any) => r.user_id).filter(Boolean))];
      // @ts-ignore - profiles table has dynamic columns
      const { data: profiles } = userIds.length > 0
        ? await supabase.from('profiles').select('id, username, fullname, avatar_url').in('id', userIds)
        : { data: [] };

      return (data || []).map((recipe: any) => {
        const profile = (profiles || []).find((p: any) => p.id === recipe.user_id);
        return {
          ...recipe,
          author_name: profile?.fullname || profile?.username || 'Anonim',
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          category_name: recipe.category?.name || 'Genel',
          view_count: recipe.view_count || 0,
          like_count: recipe.like_count || 0,
          comment_count: recipe.comment_count || 0,
        };
      });
    },
    enabled: searchTerm.length > 0,
  });
};

export const useRecipesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['recipes', 'category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('category_id', categoryId)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes by category:', error);
        throw error;
      }

      // Fetch profiles separately
      const userIds = [...new Set((data || []).map((r: any) => r.user_id).filter(Boolean))];
      // @ts-ignore - profiles table has dynamic columns
      const { data: profiles } = userIds.length > 0
        ? await supabase.from('profiles').select('id, username, fullname, avatar_url').in('id', userIds)
        : { data: [] };

      return (data || []).map((recipe: any) => {
        const profile = (profiles || []).find((p: any) => p.id === recipe.user_id);
        return {
          ...recipe,
          author_name: profile?.fullname || profile?.username || 'Anonim',
          author_username: profile?.username,
          author_avatar: profile?.avatar_url,
          category_name: recipe.category?.name || 'Genel',
        };
      });
    },
    enabled: !!categoryId,
  });
};

export const useRecipeById = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      // Try to fetch by slug first, then by id
      let query = supabase
        .from('recipes')
        .select(`
          *,
          category:categories(name, slug)
        `);

      // Check if id looks like a UUID or a slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (isUUID) {
        query = query.eq('id', id);
      } else {
        query = (query as any).eq('slug', id);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Tarif bulunamadı');
      }

      // Fetch profile separately
      let profile: any = null;
      if ((data as any).user_id) {
        // @ts-ignore - profiles table has dynamic columns
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, fullname, avatar_url, bio')
          .eq('id', (data as any).user_id)
          .single();
        profile = profileData;
      }

      return {
        ...data,
        author_name: profile?.fullname || profile?.username || 'Anonim',
        author_username: profile?.username,
        author_avatar: profile?.avatar_url,
        category_name: (data as any).category?.name || 'Genel',
      };
    },
    enabled: !!id,
  });
};
