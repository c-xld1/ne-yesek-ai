
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipe: RecipeInsert) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();

      if (error) {
        console.error('Error creating recipe:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch recipes
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
