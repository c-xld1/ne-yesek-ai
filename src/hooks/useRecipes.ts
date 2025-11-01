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
          category:categories(name),
          profile:profiles(username, fullname, avatar_url)
        `)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      return (recipes || []).map((recipe: any) => ({
        ...recipe,
        author_name: recipe.profile?.fullname || recipe.profile?.username || 'Anonim',
        category_name: recipe.category?.name || 'Genel',
      }));
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
          category:categories(name),
          profile:profiles(username, fullname, avatar_url)
        `)
        .eq('is_featured', true)
        .eq('is_draft', false)
        .order('views', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching featured recipes:', error);
        throw error;
      }

      return (data || []).map((recipe: any) => ({
        ...recipe,
        author_name: recipe.profile?.fullname || recipe.profile?.username || 'Anonim',
        category_name: recipe.category?.name || 'Genel',
      }));
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
          category:categories(name),
          profile:profiles(username, fullname, avatar_url)
        `)
        .eq('is_draft', false)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);

      if (error) {
        console.error('Error searching recipes:', error);
        throw error;
      }

      return (data || []).map((recipe: any) => ({
        ...recipe,
        author_name: recipe.profile?.fullname || recipe.profile?.username || 'Anonim',
        category_name: recipe.category?.name || 'Genel',
      }));
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
          category:categories(name),
          profile:profiles(username, fullname, avatar_url)
        `)
        .eq('category_id', categoryId)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes by category:', error);
        throw error;
      }

      return (data || []).map((recipe: any) => ({
        ...recipe,
        author_name: recipe.profile?.fullname || recipe.profile?.username || 'Anonim',
        category_name: recipe.category?.name || 'Genel',
      }));
    },
    enabled: !!categoryId,
  });
};

export const useRecipeById = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          category:categories(name, slug),
          profile:profiles(username, fullname, avatar_url, bio)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Tarif bulunamadı');
      }

      return {
        ...data,
        author_name: data.profile?.fullname || data.profile?.username || 'Anonim',
        category_name: data.category?.name || 'Genel',
      };
    },
    enabled: !!id,
  });
};
