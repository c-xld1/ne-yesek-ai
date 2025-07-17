import { useState } from 'react';
import { addRecipe, updateRecipe, upsertProfile, addVideoStory } from '@/lib/supabaseOperations';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Insert'];
type Profile = Database['public']['Tables']['profiles']['Insert'];
type VideoStory = Database['public']['Tables']['video_stories']['Insert'];

export const useSupabaseOperations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const handleOperation = async <T>(operation: () => Promise<T>): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await operation();
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata oluştu';
            setError(errorMessage);
            console.error('Supabase işlem hatası:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const saveRecipe = async (recipeData: Recipe) => {
        return handleOperation(() => addRecipe(recipeData));
    };

    const editRecipe = async (id: string, updates: Partial<Recipe>) => {
        return handleOperation(() => updateRecipe(id, updates));
    };

    const saveProfile = async (profileData: Profile) => {
        return handleOperation(() => upsertProfile(profileData));
    };

    const saveVideoStory = async (videoStoryData: VideoStory) => {
        return handleOperation(() => addVideoStory(videoStoryData));
    };

    return {
        loading,
        error,
        clearError,
        saveRecipe,
        editRecipe,
        saveProfile,
        saveVideoStory,
    };
};
