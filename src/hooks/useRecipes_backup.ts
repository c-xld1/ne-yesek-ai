import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  author_name?: string;
  rating?: number;
  category_name?: string;
};

export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      try {
        // Supabase'den tarifleri çek (basit select)
        const { data: recipes, error } = await supabase
          .from('recipes')
          .select('id, title, description, content, image_url, cooking_time, difficulty, created_at, updated_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching recipes:', error);
          throw error;
        }

        if (!recipes || recipes.length === 0) {
          console.log('No recipes found in Supabase');
          return [];
        }

        // Supabase'den gelen verileri formatla
        return recipes.map(recipe => ({
          ...recipe,
          author_name: 'Ne Yesek AI',
          category_name: 'Genel',
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10 // 3.0-5.0 arası rating
        }));

      } catch (error) {
        console.error('Error in useRecipes:', error);
        return [];
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// Kategoriye göre tarifleri getir
export const useRecipesByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['recipes', 'category', categorySlug],
    queryFn: async () => {
      try {
        const { data: recipes, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching recipes by category:', error);
          throw error;
        }

        return recipes?.map(recipe => ({
          ...recipe,
          author_name: 'Ne Yesek AI',
          category_name: 'Genel',
          rating: recipe.rating || Math.round((Math.random() * 2 + 3) * 10) / 10
        })) || [];

      } catch (error) {
        console.error('Error in useRecipesByCategory:', error);
        return [];
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Öne çıkan tarifleri getir
export const useFeaturedRecipes = () => {
  return useQuery({
    queryKey: ['recipes', 'featured'],
    queryFn: async () => {
      try {
        const { data: recipes, error } = await supabase
          .from('recipes')
          .select('id, title, description, content, image_url, cooking_time, difficulty, created_at, updated_at')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Supabase error fetching featured recipes:', error);
          throw error;
        }

        return recipes?.map(recipe => ({
          ...recipe,
          author_name: 'Ne Yesek AI',
          category_name: 'Genel',
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10
        })) || [];

      } catch (error) {
        console.error('Error in useFeaturedRecipes:', error);
        return [];
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Tarif arama
export const useSearchRecipes = (searchTerm: string) => {
  return useQuery({
    queryKey: ['recipes', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      try {
        const { data: recipes, error } = await supabase
          .from('recipes')
          .select(`
            id,
            title,
            description,
            content,
            image_url,
            cooking_time,
            servings,
            difficulty,
            rating,
            is_featured,
            is_published,
            created_at,
            updated_at
          `)
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error searching recipes:', error);
          throw error;
        }

        return recipes?.map(recipe => ({
          ...recipe,
          author_name: 'Ne Yesek AI',
          category_name: 'Genel',
          rating: recipe.rating || Math.round((Math.random() * 2 + 3) * 10) / 10
        })) || [];

      } catch (error) {
        console.error('Error in useSearchRecipes:', error);
        return [];
      }
    },
    enabled: !!searchTerm.trim(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Kategoriye göre tarifleri getir
export const useRecipesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['recipes', 'category', categoryId],
    queryFn: async () => {
      if (!categoryId.trim()) return [];

      try {
        const { data: recipes, error } = await supabase
          .from('recipes')
          .select(`
            id,
            title,
            description,
            content,
            image_url,
            cooking_time,
            servings,
            difficulty,
            rating,
            is_featured,
            is_published,
            created_at,
            updated_at
          `)
          .eq('category_id', categoryId)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching recipes by category:', error);
          throw error;
        }

        return recipes?.map(recipe => ({
          ...recipe,
          author_name: 'Ne Yesek AI',
          category_name: 'Genel',
          rating: recipe.rating || Math.round((Math.random() * 2 + 3) * 10) / 10
        })) || [];

      } catch (error) {
        console.error('Error in useRecipesByCategory:', error);
        return [];
      }
    },
    enabled: !!categoryId.trim(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Tek tarif getir
export const useRecipeById = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      if (!id) throw new Error('Recipe ID is required');

      try {
        const { data: recipe, error } = await supabase
          .from('recipes')
          .select(`
            id,
            title,
            description,
            content,
            image_url,
            cooking_time,
            servings,
            difficulty,
            rating,
            is_featured,
            is_published,
            created_at,
            updated_at
          `)
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (error) {
          console.error('Supabase error fetching recipe:', error);
          throw error;
        }

        if (!recipe) {
          throw new Error('Recipe not found');
        }

        return {
          ...recipe,
          author_name: 'Ne Yesek AI',
          category_name: 'Genel',
          rating: recipe.rating || Math.round((Math.random() * 2 + 3) * 10) / 10
        };

      } catch (error) {
        console.error('Error in useRecipeById:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};