import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTestData = () => {
  const [status, setStatus] = useState<{
    connected: boolean;
    recipes: number;
    profiles: number;
    categories: number;
    error?: string;
  }>({
    connected: false,
    recipes: 0,
    profiles: 0,
    categories: 0
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test recipes
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select('id, title')
          .limit(100);

        if (recipesError) {
          setStatus(prev => ({ ...prev, error: `Recipes error: ${recipesError.message}` }));
          return;
        }

        // Test profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .limit(100);

        if (profilesError) {
          setStatus(prev => ({ ...prev, error: `Profiles error: ${profilesError.message}` }));
          return;
        }

        // Test categories
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .limit(100);

        if (categoriesError) {
          setStatus(prev => ({ ...prev, error: `Categories error: ${categoriesError.message}` }));
          return;
        }

        console.log('Test data loaded:', {
          recipes: recipes?.length || 0,
          profiles: profiles?.length || 0,
          categories: categories?.length || 0
        });

        setStatus({
          connected: true,
          recipes: recipes?.length || 0,
          profiles: profiles?.length || 0,
          categories: categories?.length || 0
        });

      } catch (error) {
        console.error('Test data error:', error);
        setStatus(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
      }
    };

    testConnection();
  }, []);

  return status;
};
