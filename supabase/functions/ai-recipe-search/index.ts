import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Search recipes that contain any of the ingredients
    const ingredientList = ingredients.split(',').map((i: string) => i.trim().toLowerCase());
    
    const { data: recipes, error } = await supabaseClient
      .from('recipes')
      .select('*')
      .limit(10);

    if (error) throw error;

    // Simple matching algorithm
    const matchedRecipes = recipes?.filter((recipe: any) => {
      if (!recipe.ingredients) return false;
      
      const recipeIngredients = JSON.stringify(recipe.ingredients).toLowerCase();
      return ingredientList.some((ingredient: string) => 
        recipeIngredients.includes(ingredient)
      );
    });

    return new Response(
      JSON.stringify({ recipes: matchedRecipes || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
