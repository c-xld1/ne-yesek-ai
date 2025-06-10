
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRecipeStats = () => {
  return useQuery({
    queryKey: ['recipe-stats'],
    queryFn: async () => {
      // Get recipe count by category
      const { data: categoryStats, error } = await supabase
        .from('recipes')
        .select('category_id')
        .not('category_id', 'is', null);
      
      if (error) {
        console.error('Error fetching recipe stats:', error);
        throw error;
      }
      
      // Count recipes by category
      const stats = categoryStats?.reduce((acc: Record<string, number>, recipe) => {
        const categoryId = recipe.category_id;
        if (categoryId) {
          acc[categoryId] = (acc[categoryId] || 0) + 1;
        }
        return acc;
      }, {}) || {};
      
      return stats;
    },
  });
};
