
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};

export const useRecipeById = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });
};

export const useRecipesByCategory = (category?: string) => {
  return useQuery({
    queryKey: ['recipes', 'category', category],
    queryFn: async () => {
      let query = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If we had a category field, we would filter here
      // For now, we'll just return all recipes
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching recipes by category:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};
