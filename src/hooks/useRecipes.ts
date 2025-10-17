import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getAllRecipes } from '@/lib/supabaseOperations';
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
                // Demo mod veya gerçek veritabanı farketmeksizin tarifleri al
                const recipesRaw = await getAllRecipes();
                return (recipesRaw as any[]).map((recipe: any) => ({
                    ...recipe,
                    author_name: 'Ne Yesek AI',
                    category_name: 'Genel',
                    rating: recipe.rating || Math.round((Math.random() * 2 + 3) * 10) / 10
                }));

            } catch (error) {
                console.error('Error in useRecipes:', error);
                return [];
            }
        },
        retry: 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useFeaturedRecipes = () => {
    return useQuery({
        queryKey: ['recipes', 'featured'],
        queryFn: async () => {
            try {
                const { data: recipes, error } = await supabase
                    .from('recipes')
                    .select('id, title, description, content, image_url, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_featured, views, rating, created_at, updated_at')
                    .eq('is_featured', true)
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
                    rating: recipe.rating || Math.round((Math.random() * 2 + 3) * 10) / 10
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

export const useSearchRecipes = (searchTerm: string) => {
    return useQuery({
        queryKey: ['recipes', 'search', searchTerm],
        queryFn: async () => {
            if (!searchTerm.trim()) return [];

            try {
                const { data: recipes, error } = await supabase
                    .from('recipes')
                    .select('id, title, description, content, image_url, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_featured, views, rating, created_at, updated_at')
                    .or(
                      `title.ilike.%${searchTerm}%,` +
                      `description.ilike.%${searchTerm}%,` +
                      `content.ilike.%${searchTerm}%,` +
                      `ingredients::text.ilike.%${searchTerm}%`
                    )
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

export const useRecipesByCategory = (categoryId: string) => {
    return useQuery({
        queryKey: ['recipes', 'category', categoryId],
        queryFn: async () => {
            if (!categoryId.trim()) return [];

            try {
                const { data: recipes, error } = await supabase
                    .from('recipes')
                    .select('id, title, description, content, image_url, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_featured, views, rating, created_at, updated_at')
                    .contains('tags', [categoryId])
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

export const useRecipeById = (id: string) => {
    return useQuery({
        queryKey: ['recipe', id],
        queryFn: async () => {
            if (!id) throw new Error('Recipe ID is required');

            try {
                const { data: recipe, error } = await supabase
                    .from('recipes')
                    .select('id, title, description, content, image_url, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_featured, views, rating, created_at, updated_at')
                    .eq('id', id)
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
