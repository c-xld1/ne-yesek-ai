import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
const validateInput = (ingredients: string, preferences: string): { valid: boolean; error?: string } => {
  if (!ingredients || typeof ingredients !== 'string') {
    return { valid: false, error: 'Ingredients must be a non-empty string' };
  }
  if (ingredients.length > 500) {
    return { valid: false, error: 'Ingredients must be less than 500 characters' };
  }
  if (preferences && typeof preferences !== 'string') {
    return { valid: false, error: 'Preferences must be a string' };
  }
  if (preferences && preferences.length > 500) {
    return { valid: false, error: 'Preferences must be less than 500 characters' };
  }
  return { valid: true };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { ingredients, preferences } = await req.json();

    // Validate input
    const validation = validateInput(ingredients, preferences);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('AI Recipe Search - Ingredients:', ingredients);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Sen Türk mutfağı konusunda uzman bir AI şefsin. Kullanıcının verdiği malzemelerle yapılabilecek lezzetli Türk yemekleri öneriyorsun. 
            Her tarif için şunları belirt:
            - Tarif adı
            - Kısa açıklama (1-2 cümle)
            - Uyumluluk yüzdesi (kullanıcının verdiği malzemelerle ne kadar uyumlu)
            - Eksik malzemeler (varsa)
            - Hazırlık + pişirme süresi (dakika)
            - Zorluk seviyesi (kolay/orta/zor)
            - Kişi sayısı
            
            JSON formatında 3-5 tarif öner. Format:
            {
              "recipes": [
                {
                  "title": "string",
                  "description": "string",
                  "compatibility": number (0-100),
                  "missing_ingredients": ["string"],
                  "prep_time": number,
                  "cook_time": number,
                  "difficulty": "string",
                  "servings": number
                }
              ]
            }` 
          },
          { 
            role: 'user', 
            content: `Elinde şu malzemeler var: ${ingredients}${preferences ? `. Tercihler: ${preferences}` : ''}. Lütfen 3-5 tarif öner.`
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const content = data.choices[0].message.content;
    const recipes = JSON.parse(content);

    return new Response(JSON.stringify(recipes), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-recipe-suggest function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      recipes: { recipes: [] }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
